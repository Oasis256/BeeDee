import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'scraper-postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'scraperuser',
  password: process.env.POSTGRES_PASSWORD || 'scraperpass',
  database: process.env.POSTGRES_DB || 'scraperdb',
});

async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS scraped_results (
    id SERIAL PRIMARY KEY,
    test_id TEXT NOT NULL,
    results JSONB NOT NULL
  )`);
}

initDb();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/scrape/bdsm-results/:testId', async (req, res) => {
  const { testId } = req.params;
  // ...scraping logic...
  const results = [{ name: 'Dominant', percentage: 80 }, { name: 'Submissive', percentage: 20 }];
  try {
    const dbRes = await pool.query(
      'INSERT INTO scraped_results (test_id, results) VALUES ($1, $2) RETURNING id',
      [testId, JSON.stringify(results)]
    );
    res.json({ success: true, id: dbRes.rows[0].id, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/scraped-results', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT id, test_id, results FROM scraped_results');
    res.json(dbRes.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/scraped-results/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbRes = await pool.query('SELECT id, test_id, results FROM scraped_results WHERE id = $1', [id]);
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(dbRes.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/scraped-results/:id', async (req, res) => {
  const { id } = req.params;
  const { test_id, results } = req.body;
  try {
    const dbRes = await pool.query(
      'UPDATE scraped_results SET test_id = $1, results = $2 WHERE id = $3 RETURNING *',
      [test_id, JSON.stringify(results), id]
    );
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(dbRes.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/scraped-results/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dbRes = await pool.query('DELETE FROM scraped_results WHERE id = $1 RETURNING id', [id]);
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
