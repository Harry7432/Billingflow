import { userCompanyRoutes } from "./modules/auth/user-company.routes.js";
import { meRoutes } from "./modules/auth/me.routes.js";
import fastifyJwt from "@fastify/jwt";
import { loginRoutes } from "./modules/auth/login.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import Fastify from "fastify";
import { prisma } from "./database/prisma.js";
import { env } from "./config/env.js";

const app = Fastify({
  logger: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.get("/health", async () => {
  await prisma.company.findFirst();

  return {
    status: "ok",
    service: "billingflow-api",
  };
});

app.register(authRoutes, {
  prefix: "/auth",
});

app.register(loginRoutes, {
  prefix: "/auth",
});
app.register(meRoutes, {
  prefix: "/auth",
});
app.register(userCompanyRoutes, {
  prefix: "/auth",
});

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(`BillingFlow API rodando na porta ${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();