from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import SKLearnVectorStore

loader = PyPDFLoader("./assets/nideesh-bk-resume.pdf")
pages = loader.load_and_split()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=45,
    separators=[
        "\n\n",
        "\nSoftware",
        "\nEmerging", 
        "\nData",
        "\n•",
        "\n",
        " ",
        "",
    ],
)

with open("./assets/project-links.txt", "r", encoding="utf-8") as f:
    text_content = f.read()
    
txt_doc = Document(page_content=text_content, metadata={"source": "project-links.txt"})

txt_chunks = text_splitter.split_documents([txt_doc])

texts = text_splitter.split_documents(pages)

texts = texts + txt_chunks

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_db_path = "./resume_vector_db.parquet"
vector_db = SKLearnVectorStore.from_documents(texts, embedding=embedding, persist_path=vector_db_path, serializer="parquet")

results = vector_db.similarity_search(
    "Nideesh's project and links"
)

vector_db.persist()

loader = TextLoader("./assets/interests.txt", encoding='utf-8')
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=45,
    separators=[
        "\n\n",
        "\n",
        "---",
    ],
)

texts = text_splitter.split_documents(documents)
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_db_path = "./interests_vector_db.parquet"
vector_db = SKLearnVectorStore.from_documents(texts, embedding=embedding, persist_path=vector_db_path, serializer="parquet")

vector_db.persist()


