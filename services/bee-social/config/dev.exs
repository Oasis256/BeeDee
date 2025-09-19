import Config

config :bee_social, BeeSocialWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "bee_social_dev_secret_key_base_change_in_production",
  watchers: []

config :logger, :console, format: "[$level] $message\n"
