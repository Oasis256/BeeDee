import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'comms-postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'commsuser',
  password: process.env.POSTGRES_PASSWORD || 'commspass',
  database: process.env.POSTGRES_DB || 'commsdb',
});

async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}
initDb();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/messages', async (req, res) => {
  const { sender, recipient, content } = req.body;
  try {
    const dbRes = await pool.query(
      'INSERT INTO messages (sender, recipient, content) VALUES ($1, $2, $3) RETURNING id',
      [sender, recipient, content]
    );
    res.json({ success: true, id: dbRes.rows[0].id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/messages', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT id, sender, recipient, content, sent_at FROM messages');
    res.json(dbRes.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbRes = await pool.query('SELECT id, sender, recipient, content, sent_at FROM messages WHERE id = $1', [id]);
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(dbRes.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbRes = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [id]);
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Comms service running on port ${PORT}`);
});
