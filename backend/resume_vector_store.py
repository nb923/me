from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import PyPDFLoader
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

texts = text_splitter.split_documents(pages)

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vector_db_path = "./resume_vector_db.parquet"
vector_db = SKLearnVectorStore.from_documents(texts, embedding=embedding, persist_path=vector_db_path, serializer="parquet")

results = vector_db.similarity_search(
    "Which project involved OpenCV"
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


