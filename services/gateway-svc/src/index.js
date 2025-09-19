import Fastify from 'fastify';
import axios from 'axios';

const fastify = Fastify({ logger: true });

fastify.get('/api/bdsm-results/:testId', async (request, reply) => {
  const { testId } = request.params;
  try {
    const scraperSvcUrl = process.env.SCRAPER_SVC_URL || 'http://scraper-svc:80';
    const response = await axios.post(`${scraperSvcUrl}/scrape/bdsm-results/${testId}`);
    reply.send(response.data);
  } catch (error) {
    reply.status(500).send({ success: false, error: error.message });
  }
});

fastify.get('/health', async (request, reply) => {
  reply.send({ status: 'ok' });
});

const PORT = process.env.PORT || 80;
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`BFF Gateway running on ${address}`);
});
