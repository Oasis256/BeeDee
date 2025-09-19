defmodule BeeSocialWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :bee_social

  # WebSocket configuration for real-time features
  socket "/socket", BeeSocialWeb.UserSocket,
    websocket: true,
    longpoll: false

  # CORS support
  plug CORSPlug, origin: "*"

  # JSON parsing
  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  # Request routing
  plug BeeSocialWeb.Router
end
