import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createUser } from "./auth.service.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const bodySchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
    });

    try {
      const { name, email, password } = bodySchema.parse(request.body);

      const user = await createUser({
        name,
        email,
        password,
      });

      return reply.status(201).send(user);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Usuário já cadastrado com este e-mail."
      ) {
        return reply.status(409).send({
          message: error.message,
        });
      }

      throw error;
    }
  });
}