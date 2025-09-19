FROM golang:1.22-alpine
WORKDIR /app
COPY . .
RUN go mod init results-svc
RUN go get github.com/gin-gonic/gin github.com/lib/pq
EXPOSE 80
CMD ["go", "run", "main.go"]
