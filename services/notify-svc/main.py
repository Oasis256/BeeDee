from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import psycopg2

app = FastAPI()

def get_db():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "notify-postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "notifyuser"),
        password=os.getenv("POSTGRES_PASSWORD", "notifypass"),
        dbname=os.getenv("POSTGRES_DB", "notifydb")
    )

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            read BOOLEAN DEFAULT FALSE
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

class Notification(BaseModel):
    id: int | None = None
    user_id: int
    message: str
    read: bool = False

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/notifications", response_model=Notification)
def create_notification(notification: Notification):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO notifications (user_id, message, read) VALUES (%s, %s, %s) RETURNING id",
            (notification.user_id, notification.message, notification.read)
        )
        notification.id = cur.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    cur.close()
    conn.close()
    return notification

@app.get("/notifications", response_model=list[Notification])
def get_notifications():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, user_id, message, read FROM notifications")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Notification(id=row[0], user_id=row[1], message=row[2], read=row[3]) for row in rows]

@app.get("/notifications/{notification_id}", response_model=Notification)
def get_notification(notification_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, user_id, message, read FROM notifications WHERE id = %s", (notification_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    return Notification(id=row[0], user_id=row[1], message=row[2], read=row[3])

@app.put("/notifications/{notification_id}", response_model=Notification)
def update_notification(notification_id: int, notification: Notification):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE notifications SET user_id = %s, message = %s, read = %s WHERE id = %s", (notification.user_id, notification.message, notification.read, notification_id))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.id = notification_id
    return notification

@app.delete("/notifications/{notification_id}")
def delete_notification(notification_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM notifications WHERE id = %s", (notification_id,))
    conn.commit()
    count = cur.rowcount
    cur.close()
    conn.close()
    if count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
