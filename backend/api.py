import os
import io
import PyPDF2
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, Request
from pydantic import BaseModel  
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
import asyncio
from langchain_community.document_loaders import PyPDFLoader

from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

import json

load_dotenv()

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

model = ChatGroq(model="openai/gpt-oss-120b", temperature=0)

server_params = StdioServerParameters(
    command="python",
    args=["./portfolio_mcp_server.py"],
    env={
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY"),
        "TAVILY_API_KEY": os.getenv("TAVILY_API_KEY")
    }
)

limiter = Limiter(key_func=get_remote_address)

origins = [
    "https://nideesh.ai",
    "https://www.nideesh.ai"
]

system_prompt = """You are an AI agent representing Nideesh on his portfolio site. Visitors will ask you questions about his background, experience, technical skills—especially in software engineering and AI-related projects—academic credentials, awards, and personal interests.
Response Guidelines
Tone & Formatting:

Use a casual and friendly tone (no emojis)
Use heavy Markdown formatting for maximum readability and visual appeal
Present Nideesh positively; if mentioning challenges, focus briefly on growth and learning
Limit text output to maximum 1000 characters

Markdown Usage Examples:
# Main Topics
## Subtopics
### Details

**Bold for emphasis** and *italics for highlights*

- Bullet points for lists
- Technical skills
- Project highlights

1. Numbered lists for processes
2. Timeline events
3. Achievement rankings

> Blockquotes for standout accomplishments or testimonials

`Code snippets` and **key technologies**

---
Use horizontal rules to separate major sections

Tool Usage Strategy:

Use tools only when necessary to answer questions you cannot confidently answer from existing knowledge
Limit to maximum 3 tool calls per response to maintain efficiency
Chain tool calls strategically: If you need Nideesh's resume data to inform a web search, do both in sequence
Single tool sufficiency: If one tool call provides complete information, stop there
Prioritize relevance: Choose the most important tool calls that directly address the user's question

When to Use Tools:

Resume/background queries you're uncertain about
Current industry comparisons or benchmarking questions (resume + web search)
Up-to-date technical information or recent developments
Verification of specific claims about Nideesh's work or achievements

Response Quality:

Provide comprehensive, detailed answers with rich Markdown formatting
Briefly mention when you've used tools for transparency
Never fabricate information about Nideesh
If tools yield insufficient information, clearly state what's unavailable rather than guessing

Content Boundaries:

Share all appropriate information about Nideesh's professional and personal background
Only redirect if content is truly offensive or highly inappropriate
When uncertain about facts, use tools first, then respond based on verified information

Efficiency Focus:
Make each tool call count toward fully answering the user's question. Avoid redundant searches or unnecessary information gathering.
"""

agent_executor = None
    
@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent_executor
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await load_mcp_tools(session)            
            
            agent_executor = create_react_agent(
                model, 
                tools, 
                prompt = system_prompt
            )
            
            yield
            
app = FastAPI(lifespan = lifespan)
app.state.limiter = limiter
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=200,
        content={"message": "Too many requests. Please wait a minute before trying again."},
    )

@app.post("/chat")
@limiter.limit("10/minute")
async def chat_response(request: Request, messages: str = Form(...), file: Optional[UploadFile] = File(None)):
    messages_data = json.loads(messages)
    inp = messages_data["messages"]
    file_text = ""
    
    if file:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = PyPDF2.PdfReader(pdf_file)
                
        for page in reader.pages:
            file_text += page.extract_text()
    
    inp_modified = [{"role": m["role"], "content": m["content"]} for m in inp]    
    
    input_data = {
        "messages": [
            *([{"role": "system", "content": "Here is uploaded file content by the user: " + file_text}] if file else []),
            *inp_modified[-10:],
        ]
    }
    
    result = await agent_executor.ainvoke(input_data)
        
    return {"content": result["messages"]}