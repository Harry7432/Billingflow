import { prisma } from "../../database/prisma.js";
import { hashPassword } from "../../services/password.service.js";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export async function createUser({
  name,
  email,
  password,
}: CreateUserInput) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    throw new Error("Usuário já cadastrado com este e-mail.");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
      createdAt: true,        
    },
  });

  return user;
}