import { prisma } from "../../database/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import {
  decrypt,
  encrypt,
} from "../../services/encryption.service.js";
import { findCompanyIntegration } from "./company-integration.repository.js";

type CreateCompanyIntegrationInput = {
  companyId: string;
  provider: string;
  name: string;
  credentials: Record<string, unknown>;
  configJson?: Record<string, unknown>;
};

type GetCompanyIntegrationInput = {
  companyId: string;
  provider: string;
  name: string;
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

export async function getCompanyIntegration({
  companyId,
  provider,
  name,
}: GetCompanyIntegrationInput) {
  const integration = await findCompanyIntegration({
    companyId,
    provider,
    name,
  });

  if (!integration) {
    throw new Error("Integração não encontrada.");
  }

  if (!integration.active) {
    throw new Error("Integração inativa.");
  }

  const credentials = JSON.parse(
    decrypt(integration.credentialsEncrypted),
  ) as Record<string, unknown>;

  return {
    id: integration.id,
    companyId: integration.companyId,
    provider: integration.provider,
    name: integration.name,
    active: integration.active,
    credentials,
    configJson: integration.configJson,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}