import Fastify from 'fastify';
import { Pool } from 'pg';
import axios from 'axios';

const fastify = Fastify({ logger: true });

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'bff-postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'bffuser',
  password: process.env.POSTGRES_PASSWORD || 'bffpass',
  database: process.env.POSTGRES_DB || 'bffdb',
});

async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}
initDb();

fastify.get('/health', async (request, reply) => {
  reply.send({ status: 'ok' });
});

fastify.post('/api/session', async (request, reply) => {
  const { user_id, token } = request.body;
  try {
    const dbRes = await pool.query(
      'INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING id',
      [user_id, token]
    );
    reply.send({ success: true, id: dbRes.rows[0].id });
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
});

fastify.get('/api/session/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const dbRes = await pool.query('SELECT id, user_id, token, created_at FROM sessions WHERE id = $1', [id]);
    if (dbRes.rows.length === 0) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    reply.send(dbRes.rows[0]);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

fastify.delete('/api/session/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const dbRes = await pool.query('DELETE FROM sessions WHERE id = $1 RETURNING id', [id]);
    if (dbRes.rows.length === 0) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 80;
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`BFF Gateway running on ${address}`);
});
