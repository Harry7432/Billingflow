import { FastifyInstance } from "fastify";
import { z } from "zod";
import { loginUser } from "./login.service.js";

export async function loginRoutes(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    try {
      const { email, password } = bodySchema.parse(request.body);

      const user = await loginUser({
        email,
        password,
      });

      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
      });

      return reply.status(200).send({
        user,
        token,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "E-mail ou senha inválidos."
      ) {
        return reply.status(401).send({
          message: error.message,
        });
      }

      if (
        error instanceof Error &&
        error.message === "Usuário inativo."
      ) {
        return reply.status(403).send({
          message: error.message,
        });
      }

      throw error;
    }
  });
}