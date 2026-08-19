import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

export async function meRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    {
      preHandler: authMiddleware,
    },
    async (request) => {
      return {
        user: request.user,
      };
    },
  );
}