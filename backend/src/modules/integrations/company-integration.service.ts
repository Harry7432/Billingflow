import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { encrypt } from "../../services/encryption.service.js";

type CreateCompanyIntegrationInput = {
  companyId: string;
  provider: string;
  name: string;
  credentials: Record<string, unknown>;
  configJson?: Record<string, unknown>;
};

export async function createCompanyIntegration({
  companyId,
  provider,
  name,
  credentials,
  configJson,
}: CreateCompanyIntegrationInput) {
  const integrationAlreadyExists =
    await prisma.companyIntegration.findUnique({
      where: {
        companyId_provider_name: {
          companyId,
          provider,
          name,
        },
      },
    });

  if (integrationAlreadyExists) {
    throw new Error("Integração já cadastrada para esta empresa.");
  }

  const credentialsEncrypted = encrypt(
    JSON.stringify(credentials),
  );

  const prismaConfigJson =
    configJson !== undefined
      ? (JSON.parse(
          JSON.stringify(configJson),
        ) as Prisma.InputJsonValue)
      : undefined;

  const integration = await prisma.companyIntegration.create({
    data: {
      companyId,
      provider,
      name,
      credentialsEncrypted,
      ...(prismaConfigJson !== undefined
        ? { configJson: prismaConfigJson }
        : {}),
    },
    select: {
      id: true,
      companyId: true,
      provider: true,
      name: true,
      active: true,
      configJson: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return integration;
}