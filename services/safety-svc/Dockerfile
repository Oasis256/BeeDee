FROM rust:1.77-slim
WORKDIR /app
COPY . .
RUN cargo init --bin && cargo add actix-web
EXPOSE 80
CMD ["cargo", "run", "--bin", "main"]
