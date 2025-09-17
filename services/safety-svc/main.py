from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import psycopg2

app = FastAPI()

def get_db():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "safety-postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "safetyuser"),
        password=os.getenv("POSTGRES_PASSWORD", "safetypass"),
        dbname=os.getenv("POSTGRES_DB", "safetydb")
    )

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS boundaries (
            id SERIAL PRIMARY KEY,
            couple_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            hard_limit BOOLEAN DEFAULT FALSE,
            soft_limit BOOLEAN DEFAULT FALSE,
            notes TEXT
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

class Boundary(BaseModel):
    id: int | None = None
    couple_id: int
    category: str
    description: str | None = None
    hard_limit: bool = False
    soft_limit: bool = False
    notes: str | None = None

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/boundaries", response_model=Boundary)
def create_boundary(boundary: Boundary):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO boundaries (couple_id, category, description, hard_limit, soft_limit, notes) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (boundary.couple_id, boundary.category, boundary.description, boundary.hard_limit, boundary.soft_limit, boundary.notes)
        )
        boundary.id = cur.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    cur.close()
    conn.close()
    return boundary

@app.get("/boundaries", response_model=list[Boundary])
def get_boundaries():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, couple_id, category, description, hard_limit, soft_limit, notes FROM boundaries")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Boundary(id=row[0], couple_id=row[1], category=row[2], description=row[3], hard_limit=row[4], soft_limit=row[5], notes=row[6]) for row in rows]

@app.get("/boundaries/{boundary_id}", response_model=Boundary)
def get_boundary(boundary_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, couple_id, category, description, hard_limit, soft_limit, notes FROM boundaries WHERE id = %s", (boundary_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Boundary not found")
    return Boundary(id=row[0], couple_id=row[1], category=row[2], description=row[3], hard_limit=row[4], soft_limit=row[5], notes=row[6])

@app.put("/boundaries/{boundary_id}", response_model=Boundary)
def update_boundary(boundary_id: int, boundary: Boundary):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE boundaries SET couple_id = %s, category = %s, description = %s, hard_limit = %s, soft_limit = %s, notes = %s WHERE id = %s", (boundary.couple_id, boundary.category, boundary.description, boundary.hard_limit, boundary.soft_limit, boundary.notes, boundary_id))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Boundary not found")
    boundary.id = boundary_id
    return boundary

@app.delete("/boundaries/{boundary_id}")
def delete_boundary(boundary_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM boundaries WHERE id = %s", (boundary_id,))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Boundary not found")
    return {"success": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
