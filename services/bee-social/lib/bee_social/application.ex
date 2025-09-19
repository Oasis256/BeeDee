defmodule BeeSocial.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Phoenix endpoint
      BeeSocialWeb.Endpoint,
      
      # Redis connection
      {Redix, host: System.get_env("REDIS_HOST", "bee-redis"), name: :redix},
      
      # Presence tracker for real-time features
      BeeSocialWeb.Presence
    ]

    opts = [strategy: :one_for_one, name: BeeSocial.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    BeeSocialWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
