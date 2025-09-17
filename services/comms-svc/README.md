# comms-svc (Elixir Phoenix)

To scaffold this service, run:

```
mix phx.new comms_svc --no-ecto --no-html
```

Then, in `router.ex`, add:
```elixir
get "/health", HealthController, :index
```

And create a simple `HealthController`:
```elixir
defmodule CommsSvcWeb.HealthController do
  use CommsSvcWeb, :controller

  def index(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
```

Update your Dockerfile to build and run the Phoenix app.
