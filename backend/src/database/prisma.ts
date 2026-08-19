import { PrismaClient } from "../generated/prisma/client";
import { env } from "../config/env.js";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});