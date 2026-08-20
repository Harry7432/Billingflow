import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyRoleMiddleware } from "../../middlewares/company-role.middleware.js";
import { createCompanyIntegration } from "./company-integration.service.js";

export async function companyIntegrationRoutes(app: FastifyInstance) {
  app.post(
    "/companies/:companyId/integrations",
    {
      preHandler: [
        authMiddleware,
        companyRoleMiddleware({
          allowedRoles: ["ADMIN", "OWNER"],
        }),
      ],
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        companyId: z.string().uuid(),
      });

      const bodySchema = z.object({
        provider: z.string().min(2),
        name: z.string().min(2),
        credentials: z.record(z.string(), z.unknown()),
        configJson: z
          .record(z.string(), z.unknown())
          .optional(),
      });

      try {
        const { companyId } = paramsSchema.parse(request.params);

        const {
          provider,
          name,
          credentials,
          configJson,
        } = bodySchema.parse(request.body);

        const integration = await createCompanyIntegration({
          companyId,
          provider,
          name,
          credentials,
          ...(configJson !== undefined ? { configJson } : {}),
        });

        return reply.status(201).send(integration);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Integração já cadastrada para esta empresa."
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







