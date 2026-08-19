import { prisma } from "../../database/prisma.js";
import { verifyPassword } from "../../services/password.service.js";

type LoginInput = {
  email: string;
  password: string;
};

export async function loginUser({
  email,
  password,
}: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const passwordIsValid = await verifyPassword(
    user.passwordHash,
    password,
  );

  if (!passwordIsValid) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (!user.active) {
    throw new Error("Usuário inativo.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
  };
}