defmodule BeeSocialWeb.ScenarioController do
  use Phoenix.Controller
  
  # Mock data for scenarios
  @scenarios [
    %{
      id: "1",
      title: "First Power Exchange",
      description: "A gentle introduction to dominance and submission",
      difficulty: "beginner",
      tags: ["power_exchange", "beginner", "communication"],
      rating: 4.5,
      user_id: "system",
      created_at: "2024-01-01T00:00:00Z"
    },
    %{
      id: "2", 
      title: "Sensory Exploration",
      description: "Discovering pleasure through different sensations",
      difficulty: "beginner",
      tags: ["sensory", "touch", "exploration"],
      rating: 4.8,
      user_id: "system",
      created_at: "2024-01-02T00:00:00Z"
    },
    %{
      id: "3",
      title: "Rope Artistry",
      description: "Beautiful and functional rope bondage techniques",
      difficulty: "intermediate",
      tags: ["bondage", "rope", "artistic"],
      rating: 4.6,
      user_id: "system",
      created_at: "2024-01-03T00:00:00Z"
    }
  ]

  def index(conn, params) do
    # Filter scenarios based on query parameters
    scenarios = case params do
      %{"difficulty" => difficulty} ->
        Enum.filter(@scenarios, fn s -> s.difficulty == difficulty end)
      %{"tag" => tag} ->
        Enum.filter(@scenarios, fn s -> tag in s.tags end)
      _ ->
        @scenarios
    end

    # Broadcast real-time update
    BeeSocialWeb.Endpoint.broadcast("scenarios:lobby", "scenarios_requested", %{
      count: length(scenarios),
      timestamp: DateTime.utc_now()
    })

    json(conn, %{
      scenarios: scenarios,
      total: length(scenarios),
      timestamp: DateTime.utc_now()
    })
  end

  def show(conn, %{"id" => id}) do
    case Enum.find(@scenarios, fn s -> s.id == id end) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Scenario not found"})
      
      scenario ->
        # Track view for analytics
        BeeSocialWeb.Endpoint.broadcast("scenarios:#{id}", "scenario_viewed", %{
          scenario_id: id,
          timestamp: DateTime.utc_now()
        })

        json(conn, scenario)
    end
  end

  def create(conn, params) do
    # In real implementation, validate and save to database
    new_scenario = %{
      id: generate_id(),
      title: params["title"],
      description: params["description"],
      difficulty: params["difficulty"] || "beginner",
      tags: params["tags"] || [],
      rating: 0.0,
      user_id: params["user_id"],
      created_at: DateTime.utc_now()
    }

    # Broadcast new scenario to real-time subscribers
    BeeSocialWeb.Endpoint.broadcast("scenarios:lobby", "new_scenario", new_scenario)

    conn
    |> put_status(:created)
    |> json(new_scenario)
  end

  def update(conn, %{"id" => id} = params) do
    case Enum.find(@scenarios, fn s -> s.id == id end) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Scenario not found"})
      
      scenario ->
        updated_scenario = Map.merge(scenario, %{
          title: params["title"] || scenario.title,
          description: params["description"] || scenario.description,
          difficulty: params["difficulty"] || scenario.difficulty,
          tags: params["tags"] || scenario.tags,
          updated_at: DateTime.utc_now()
        })

        # Broadcast update
        BeeSocialWeb.Endpoint.broadcast("scenarios:#{id}", "scenario_updated", updated_scenario)

        json(conn, updated_scenario)
    end
  end

  def delete(conn, %{"id" => id}) do
    # Broadcast deletion
    BeeSocialWeb.Endpoint.broadcast("scenarios:#{id}", "scenario_deleted", %{
      scenario_id: id,
      timestamp: DateTime.utc_now()
    })

    conn
    |> put_status(:no_content)
    |> text("")
  end

  defp generate_id do
    :crypto.strong_rand_bytes(8)
    |> Base.encode64()
    |> String.replace(["+", "/", "="], "")
    |> String.slice(0, 8)
  end
end
