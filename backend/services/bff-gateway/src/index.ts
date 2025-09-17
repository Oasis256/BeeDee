import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = Number(process.env.PORT || 8080);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'bff-gateway' }));

app.listen(PORT, () => {
  console.log('[bff-gateway] listening on', PORT);
});
