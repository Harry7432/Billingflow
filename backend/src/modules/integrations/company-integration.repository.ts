import { prisma } from "../../database/prisma.js";

type FindCompanyIntegrationInput = {
  companyId: string;
  provider: string;
  name: string;
};

export async function findCompanyIntegration({
  companyId,
  provider,
  name,
}: FindCompanyIntegrationInput) {
  return prisma.companyIntegration.findUnique({
    where: {
      companyId_provider_name: {
        companyId,
        provider,
        name,
      },
    },
  });
}