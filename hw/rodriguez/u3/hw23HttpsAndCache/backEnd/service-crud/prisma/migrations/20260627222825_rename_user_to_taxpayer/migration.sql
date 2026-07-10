-- CreateTable
CREATE TABLE "Taxpayer" (
    "id" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "birthDate" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'user',
    "profileCompleted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taxpayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "periodMonth" INTEGER,
    "periodYear" INTEGER NOT NULL,
    "periodType" TEXT NOT NULL DEFAULT 'monthly',
    "periodSemester" INTEGER,
    "workspaceLocation" TEXT NOT NULL,
    "sriConnectionStatus" TEXT NOT NULL DEFAULT 'disconnected',
    "taxpayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issuerCommercialName" TEXT,
    "issuerAddress" TEXT,
    "issuerRuc" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "authorizationNumber" TEXT NOT NULL,
    "emissionType" TEXT NOT NULL DEFAULT 'Normal',
    "accessKey" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerDate" TEXT NOT NULL,
    "customerAddress" TEXT,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "products" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'COMPRA',
    "format" TEXT NOT NULL DEFAULT 'XML',
    "taxpayerId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtsFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "invoiceCount" INTEGER NOT NULL,
    "validationErrors" INTEGER NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtsFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "taxpayerId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxpayerId" TEXT NOT NULL,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "taxpayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Taxpayer_ruc_key" ON "Taxpayer"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Taxpayer_email_key" ON "Taxpayer"("email");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtsFile" ADD CONSTRAINT "AtsFile_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtsFile" ADD CONSTRAINT "AtsFile_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessStep" ADD CONSTRAINT "ProcessStep_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessStep" ADD CONSTRAINT "ProcessStep_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
