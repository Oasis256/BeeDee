import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

const app = Fastify();
const PORT = Number(process.env.PORT || 8080);

app.get("/health", async () => ({ status: "ok" }));

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => console.log(`listening ${PORT}`))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


