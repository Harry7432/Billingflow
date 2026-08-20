-- CreateTable
CREATE TABLE "company_integrations" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "credentialsEncrypted" TEXT NOT NULL,
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_integrations_companyId_idx" ON "company_integrations"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "company_integrations_companyId_provider_name_key" ON "company_integrations"("companyId", "provider", "name");

-- AddForeignKey
ALTER TABLE "company_integrations" ADD CONSTRAINT "company_integrations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
