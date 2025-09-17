FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn sqlite3
EXPOSE 80
CMD ["python", "main.py"]
