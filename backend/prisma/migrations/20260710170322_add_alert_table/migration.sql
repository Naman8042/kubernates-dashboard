-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "clusterId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "pod" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alert_clusterId_namespace_pod_status_key" ON "Alert"("clusterId", "namespace", "pod", "status");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
