import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { linkUserToCompany } from "./user-company.service.js";

export async function userCompanyRoutes(app: FastifyInstance) {
  app.post(
    "/user-companies",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      const bodySchema = z.object({
        userId: z.string().uuid(),
        companyId: z.string().uuid(),
        role: z.string().optional(),
      });

      try {
        const { userId, companyId, role } = bodySchema.parse(request.body);

        const relation = await linkUserToCompany({
          userId,
          companyId,
          ...(role !== undefined ? { role } : {}),
        });

        return reply.status(201).send(relation);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Usuário já está vinculado a esta empresa."
        ) {
          return reply.status(409).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}