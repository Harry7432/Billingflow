import { prisma } from "../../database/prisma.js";

type LinkUserToCompanyInput = {
  userId: string;
  companyId: string;
  role?: string;
};

export async function linkUserToCompany({
  userId,
  companyId,
  role = "MEMBER",
}: LinkUserToCompanyInput) {
  const relationAlreadyExists = await prisma.userCompany.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (relationAlreadyExists) {
    throw new Error("Usuário já está vinculado a esta empresa.");
  }

  const relation = await prisma.userCompany.create({
    data: {
      userId,
      companyId,
      role,
    },
  });

  return relation;
}