

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import psycopg2

app = FastAPI()

def get_db():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "profilesuser"),
        password=os.getenv("POSTGRES_PASSWORD", "profilespass"),
        dbname=os.getenv("POSTGRES_DB", "profilesdb")
    )

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

class Profile(BaseModel):
    id: int | None = None
    name: str
    email: str
    age: int

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/profiles", response_model=Profile)
def create_profile(profile: Profile):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO profiles (name, email, age) VALUES (%s, %s, %s) RETURNING id",
            (profile.name, profile.email, profile.age)
        )
        profile.id = cur.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    cur.close()
    conn.close()
    return profile

@app.get("/profiles", response_model=list[Profile])
def get_profiles():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, age FROM profiles")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Profile(id=row[0], name=row[1], email=row[2], age=row[3]) for row in rows]

@app.get("/profiles/{profile_id}", response_model=Profile)
def get_profile(profile_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, age FROM profiles WHERE id = %s", (profile_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(id=row[0], name=row[1], email=row[2], age=row[3])

@app.put("/profiles/{profile_id}", response_model=Profile)
def update_profile(profile_id: int, profile: Profile):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE profiles SET name = %s, email = %s, age = %s WHERE id = %s", (profile.name, profile.email, profile.age, profile_id))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.id = profile_id
    return profile

@app.delete("/profiles/{profile_id}")
def delete_profile(profile_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM profiles WHERE id = %s", (profile_id,))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"success": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
