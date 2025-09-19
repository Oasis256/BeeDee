# Simplified Elixir service
FROM elixir:1.15-alpine

# Install dependencies
RUN apk add --no-cache build-base git openssl ncurses-libs

WORKDIR /app

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy mix files
COPY mix.exs ./

# Install dependencies
RUN mix deps.get

# Copy source code
COPY . .

# Compile
RUN mix compile

# Create non-root user
RUN adduser -D -s /bin/sh beeuser && chown -R beeuser:beeuser /app
USER beeuser

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:4000/health || exit 1

# Start the application
CMD ["mix", "phx.server"]
