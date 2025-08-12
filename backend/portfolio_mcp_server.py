
import os
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from langchain_community.vectorstores import SKLearnVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from tavily import TavilyClient

load_dotenv()

for key in ["GROQ_API_KEY", "TAVILY_API_KEY"]:
    val = os.getenv(key)
    if val:
        os.environ[key] = val
    else:
        raise EnvironmentError(f"mcp.py {key} is not set.")

os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")

mcp = FastMCP("Portfolio Agent Tools")
resume_db_path = "./resume_vector_db.parquet"
interests_db_path = "./interests_vector_db.parquet"
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

tavily_client = TavilyClient()

resume_vector_db = SKLearnVectorStore(
    embedding=embedding, persist_path=resume_db_path, serializer="parquet"
)

interests_vector_db = SKLearnVectorStore(
    embedding=embedding, persist_path=interests_db_path, serializer="parquet"
)

loader = PyPDFLoader("./assets/nideesh-bk-resume.pdf", mode="single")
docs = loader.load()

@mcp.tool(description="Search Nideesh's resume for relevant sections matching the query string and return those snippets.")
def query_resume(query: str):
    results = resume_vector_db.similarity_search(query)
    return [result.page_content for result in results]

@mcp.tool(description="Search Nideesh's interests text for relevant sections matching the query string and return those snippets.")
def query_interests(query: str):
    results = interests_vector_db.similarity_search(query)
    return [result.page_content for result in results]

@mcp.tool(description="Return the full content of Nideesh's resume as a single text string.")
def resume_dump():
    return docs[0].page_content

@mcp.tool(description="Search the web for information that you may not known.")
def search_web(query: str):
    response = tavily_client.search(query=query)
    return response["results"]
    

if __name__ == "__main__":
    mcp.run(transport="stdio")