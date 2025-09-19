defmodule BeeSocialWeb.Router do
  use Phoenix.Router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BeeSocialWeb do
    pipe_through :api

    # Health check
    get "/health", HealthController, :index

    # API routes
    scope "/api" do
      # Scenario management
      get "/scenarios", ScenarioController, :index
      post "/scenarios", ScenarioController, :create
      get "/scenarios/:id", ScenarioController, :show
      put "/scenarios/:id", ScenarioController, :update
      delete "/scenarios/:id", ScenarioController, :delete

      # Community features
      get "/community/:user_id", CommunityController, :show
      post "/community/join", CommunityController, :join
      get "/community/feed", CommunityController, :feed

      # Real-time messaging
      post "/messages", MessageController, :create
      get "/messages/:user_id", MessageController, :index

      # Social compatibility
      post "/social/compatibility", CompatibilityController, :analyze
    end
  end
end
