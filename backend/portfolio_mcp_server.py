from mcp.server.fastmcp import FastMCP
from langchain_community.vectorstores import SKLearnVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

mcp = FastMCP("Portfolio Agent Tools")
resume_db_path = "./resume_vector_db.parquet"
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

vector_db = SKLearnVectorStore(
    embedding=embedding, persist_path=resume_db_path, serializer="parquet"
)
@mcp.tool()
def query_resume(query: str):
    results = vector_db.similarity_search(query)
    return [result.page_content for result in results]
    

if __name__ == "__main__":
    mcp.run(transport="stdio")