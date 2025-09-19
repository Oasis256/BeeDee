import Config

# General configuration
config :bee_social,
  namespace: BeeSocial

# Configures the endpoint
config :bee_social, BeeSocialWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [json: BeeSocialWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: BeeSocial.PubSub,
  live_view: [signing_salt: "bee_social_salt"]

# Configures JSON library
config :phoenix, :json_library, Jason

# Import environment specific config
import_config "#{config_env()}.exs"
