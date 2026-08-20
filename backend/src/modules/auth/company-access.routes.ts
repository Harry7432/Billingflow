import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyRoleMiddleware } from "../../middlewares/company-role.middleware.js";

export async function companyAccessRoutes(app: FastifyInstance) {
  app.get(
    "/companies/:companyId/admin-area",
    {
      preHandler: [
        authMiddleware,
        companyRoleMiddleware({
          allowedRoles: ["ADMIN", "OWNER"],
        }),
      ],
    },
    async (request) => {
      return {
        message: "Acesso autorizado à área administrativa da empresa.",
        user: request.user,
      };
    },
  );
}