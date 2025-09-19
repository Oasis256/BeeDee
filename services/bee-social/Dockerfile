# Multi-stage build for Elixir/Phoenix
FROM elixir:1.15-alpine AS builder

# Install build dependencies
RUN apk add --no-cache build-base git

WORKDIR /app

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy mix files first for better caching
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mix deps.compile

# Copy source code
COPY . .

# Compile the application
RUN MIX_ENV=prod mix compile

# Production stage
FROM elixir:1.15-alpine

# Install runtime dependencies
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

# Copy the compiled application from builder
COPY --from=builder /app/_build/prod ./

# Create non-root user
RUN adduser -D -s /bin/sh beeuser
USER beeuser

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:4000/health || exit 1

# Start the application
CMD ["./rel/bee_social/bin/bee_social", "start"]
