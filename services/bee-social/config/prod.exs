import Config

config :bee_social, BeeSocialWeb.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [host: {:system, "HOST"}, port: {:system, "PORT"}],
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: true

config :logger, level: :info
