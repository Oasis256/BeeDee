# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

# Install git and ca-certificates for Go module downloads
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Copy go.mod first for better caching
COPY go.mod ./

# Download dependencies (this will generate go.sum)
RUN go mod download

# Copy source files
COPY . .

# Ensure go.sum is up to date
RUN go mod tidy

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Create public directory for static files
RUN mkdir -p public

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/health || exit 1

# Run the binary
CMD ["./main"]
