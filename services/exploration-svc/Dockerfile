FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*
RUN pip install fastapi uvicorn psycopg2-binary
EXPOSE 80
CMD ["sh", "wait-for-bee-db.sh", "bee-db", "5432", "python", "main.py"]
