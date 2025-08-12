FROM python:3.13-windowsservercore-ltsc2022

WORKDIR /app

COPY backend/ ./backend/

RUN pip install --upgrade pip
RUN pip install -r backend/requirements.txt

EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
