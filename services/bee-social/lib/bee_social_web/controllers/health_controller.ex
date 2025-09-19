defmodule BeeSocialWeb.HealthController do
  use Phoenix.Controller

  def index(conn, _params) do
    json(conn, %{
      status: "ok",
      service: "bee-social",
      timestamp: DateTime.utc_now(),
      realtime_ready: true
    })
  end
end
