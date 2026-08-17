import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "billingflow-api",
  };
});

const start = async () => {
  try {
    await app.listen({
      port: 3333,
      host: "0.0.0.0",
    });

    console.log("BillingFlow API rodando na porta 3333");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();