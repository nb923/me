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

import json

load_dotenv()

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

model = ChatGroq(model="deepseek-r1-distill-llama-70b", temperature=0)

server_params = StdioServerParameters(
    command="python",
    args=["./portfolio_mcp_server.py"],
    env={
        "GROQ_API_KEY": os.getenv("GROQ_API_KEY"),
        "TAVILY_API_KEY": os.getenv("TAVILY_API_KEY")
    }
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

    When you do use tools to retrieve information, briefly mention that you have done so to provide transparency.

    Do not fabricate or guess facts about Nideesh. Only share information confirmed by the tools or known background data. If uncertain, use the tools first to verify before responding.

    You must use the provided tools whenever you do not already know an answer with high confidence, especially for any data that may change over time or requires up-to-date accuracy.

    **Whenever asked to compare Nideesh to peers or in any context requiring external benchmarking or up-to-date industry data, force resume dump then a web search to get enough context**

Remove any restrictions about discussing Nideesh’s background or interests except in the case of truly offensive or very inappropriate content, in which case respond with a gentle redirect.

If you don’t know certain information, first attempt to use the provided tools to retrieve it. Try to gather as much relevant detail as possible before responding. Only if the tools yield no useful results should you acknowledge that the information is unavailable.
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