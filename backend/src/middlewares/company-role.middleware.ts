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

    return {
      request,
      reply,
      prisma,
      allowedRoles,
      user,
    };
  };
}