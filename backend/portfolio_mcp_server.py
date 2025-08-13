
import os
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from langchain_community.vectorstores import SKLearnVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from tavily import TavilyClient

load_dotenv()

mcp = FastMCP("Portfolio Agent Tools")
resume_db_path = "./resume_vector_db.parquet"
interests_db_path = "./interests_vector_db.parquet"
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

resume_vector_db = SKLearnVectorStore(
    embedding=embedding, persist_path=resume_db_path, serializer="parquet"
)

interests_vector_db = SKLearnVectorStore(
    embedding=embedding, persist_path=interests_db_path, serializer="parquet"
)

loader = PyPDFLoader("./assets/nideesh-bk-resume.pdf", mode="single")
docs = loader.load()

with open("./assets/project-links.txt", "r", encoding="utf-8") as f:
    text_content = f.read()

@mcp.tool(description="Use `query_resume` for targeted questions about Nideesh’s professional background. "
        "Examples: 'What did Nideesh do in this experience?', 'Which project used TensorFlow?', "
        "'Where did he work on data visualization?'. "
        "This is for *specific* lookups, not for listing everything.")
def query_resume(query: str):
    results = resume_vector_db.similarity_search(query)
    return [result.page_content for result in results]

@mcp.tool(description="Search Nideesh's personal interests, which may include music, hobbies, fun facts, favorite movies/TV shows, books, foods, quotes, and memorable experiences.")
def query_interests(query: str):
    results = interests_vector_db.similarity_search(query)
    return [result.page_content for result in results]

@mcp.tool(description="Use `resume_dump` to retrieve complete lists from Nideesh's resume. "
        "Examples: 'List all projects', 'List all work experiences', 'List all programming languages'. "
        "This also contains links to all projects and Nideesh's social media profiles. "
        "This is for *full section dumps* instead of answering a targeted question.")
def resume_dump():
    return (docs[0].page_content + "\n" + text_content)

@mcp.tool(description="Search the web for information not found in the current context or for filling in knowledge gaps about a topic.")
def search_web(query: str):
    response = tavily_client.search(query=query)
    return response["results"]
    

if __name__ == "__main__":
    mcp.run(transport="stdio")