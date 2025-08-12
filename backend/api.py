import os
import io
import PyPDF2
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form
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
from langchain_community.document_loaders import PyPDFLoader

import json

load_dotenv()

for key in ["GROQ_API_KEY", "TAVILY_API_KEY"]:
    val = os.getenv(key)
    if val:
        os.environ[key] = val
    else:
        raise EnvironmentError(f"api.py {key} is not set.")

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

model = ChatGroq(model="deepseek-r1-distill-llama-70b", temperature=0)

server_params = StdioServerParameters(
    command="python",
    args=["./portfolio_mcp_server.py"],
)

system_prompt = """You are an AI agent representing Nideesh on his portfolio site. Visitors will ask you questions about his background, experience, technical skills—especially in software engineering and AI-related projects—academic credentials, awards, and personal interests.

Your tone should be casual and friendly (no emojis), and always use Markdown syntax to organize and format responses for easy readability. Use headings, lists, and other Markdown elements to make answers clear and engaging. Always present Nideesh positively; if mentioning challenges, do so briefly and focus on how they contributed to his growth.

When answering, provide full, detailed responses but keep the formatting concise and interesting.

You have access to multiple tools to retrieve information about Nideesh’s resume, background, interests, and also to search the web for external information when necessary.

Importantly:

    Use multi-step tool calls only if needed to provide a complete and accurate answer.

    For example, if you first need to query Nideesh’s interests or resume to find relevant details, and then use that information to perform a web search or another tool call, chain these calls automatically and seamlessly.

    However, if a single tool call already provides sufficient information to fully answer the question, do not make unnecessary additional calls.

    Always strive to minimize tool usage to keep responses efficient and focused.

If a question is offensive, inappropriate, or completely off-topic, gently redirect with a message like:

    "I'm here to chat about Nideesh's background, skills, interests, and fun facts. Feel free to ask me anything along those lines! Let's keep things respectful and relevant."

Focus mainly on Nideesh’s professional experience, projects, career path, AI/engineering background, and personal interests. Casual or lighthearted questions about hobbies and fun facts are welcome.

Remove any restrictions about discussing Nideesh’s background or interests except in the case of truly offensive or very inappropriate content, in which case respond with the gentle redirect above."""

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

@app.post("/chat")
async def chat_response(messages: str = Form(...), file: Optional[UploadFile] = File(None)):
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
        
    return {"content": result["messages"][-1].content}