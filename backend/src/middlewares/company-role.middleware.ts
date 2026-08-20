import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database/prisma.js";

type CompanyRole = "OWNER" | "ADMIN" | "MEMBER";

type CompanyRoleMiddlewareOptions = {
  allowedRoles: CompanyRole[];
};

export function companyRoleMiddleware({
  allowedRoles,
}: CompanyRoleMiddlewareOptions) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const user = request.user as {
      sub: string;
      email: string;
    };

    const params = request.params as {
      companyId?: string;
    };

    const companyId = params.companyId;

    if (!companyId) {
      return reply.status(400).send({
        message: "Empresa não informada.",
      });
    }

    const userCompany = await prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId: user.sub,
          companyId,
        },
      },
    });

    if (!userCompany) {
      return reply.status(403).send({
        message: "Usuário não possui acesso a esta empresa.",
      });
    }

    if (!allowedRoles.includes(userCompany.role as CompanyRole)) {
      return reply.status(403).send({
        message: "Usuário não possui permissão para esta operação.",
      });
    }
  };
}