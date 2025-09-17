from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import psycopg2

app = FastAPI()

def get_db():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "exploration-postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "explorationuser"),
        password=os.getenv("POSTGRES_PASSWORD", "explorationpass"),
        dbname=os.getenv("POSTGRES_DB", "explorationdb")
    )

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS scenarios (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

class Scenario(BaseModel):
    id: int | None = None
    title: str
    description: str

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/scenarios", response_model=Scenario)
def create_scenario(scenario: Scenario):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO scenarios (title, description) VALUES (%s, %s) RETURNING id",
            (scenario.title, scenario.description)
        )
        scenario.id = cur.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    cur.close()
    conn.close()
    return scenario

@app.get("/scenarios", response_model=list[Scenario])
def get_scenarios():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, title, description FROM scenarios")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Scenario(id=row[0], title=row[1], description=row[2]) for row in rows]

@app.get("/scenarios/{scenario_id}", response_model=Scenario)
def get_scenario(scenario_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, title, description FROM scenarios WHERE id = %s", (scenario_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return Scenario(id=row[0], title=row[1], description=row[2])

@app.put("/scenarios/{scenario_id}", response_model=Scenario)
def update_scenario(scenario_id: int, scenario: Scenario):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE scenarios SET title = %s, description = %s WHERE id = %s", (scenario.title, scenario.description, scenario_id))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Scenario not found")
    scenario.id = scenario_id
    return scenario

@app.delete("/scenarios/{scenario_id}")
def delete_scenario(scenario_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM scenarios WHERE id = %s", (scenario_id,))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return {"success": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
