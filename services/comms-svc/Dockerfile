FROM elixir:1.16-alpine
WORKDIR /app

# Install Hex and Phoenix
RUN mix local.hex --force && \
	mix archive.install hex phx_new --force

# Generate Phoenix app if not present
RUN [ ! -d "comms_svc" ] && mix phx.new comms_svc --no-ecto --no-html || true

WORKDIR /app/comms_svc

# Copy custom code (controllers, router, etc.) if needed
# COPY ./custom_code/* ./

# Install dependencies and build assets
RUN mix deps.get && mix deps.compile

EXPOSE 80

CMD ["mix", "phx.server"]
