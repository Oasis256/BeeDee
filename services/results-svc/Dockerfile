FROM golang:1.22-alpine
WORKDIR /app
COPY . .
RUN go mod init results-svc && go get github.com/gin-gonic/gin
EXPOSE 80
CMD ["go", "run", "main.go"]
