// services/audit.service.js
import { prisma } from "../prisma/prisma.js";
export async function createAuditLog({ platform, externalId, command, status, response, clusterId, organizationId, }) {
    return prisma.auditLog.create({
        data: {
            platform,
            externalId,
            command,
            status,
            response,
            clusterId,
            organizationId,
        },
    });
}
