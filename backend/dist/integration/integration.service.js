import crypto from "crypto";
import { prisma } from "../prisma/prisma.js";
export class IntegrationService {
    static generateCode() {
        return crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();
    }
    static async createLinkCode(organizationId, platform) {
        const code = this.generateCode();
        return prisma.integrationRequest.create({
            data: {
                code,
                platform,
                organizationId,
                expiresAt: new Date(Date.now() +
                    10 *
                        60 *
                        1000),
            },
        });
    }
    static async verifyCode(code, externalId, username) {
        const request = await prisma.integrationRequest.findUnique({
            where: {
                code,
            },
        });
        if (!request) {
            throw new Error("Invalid code");
        }
        if (request.used) {
            throw new Error("Code already used");
        }
        if (request.expiresAt <
            new Date()) {
            throw new Error("Code expired");
        }
        const integration = await prisma.integration.create({
            data: {
                organizationId: request.organizationId,
                platform: request.platform,
                externalId,
                username,
                verified: true,
            },
        });
        await prisma.integrationRequest.update({
            where: {
                id: request.id,
            },
            data: {
                used: true,
            },
        });
        return integration;
    }
    static async list(organizationId) {
        return prisma.integration.findMany({
            where: {
                organizationId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async remove(id, organizationId) {
        return prisma.integration.deleteMany({
            where: {
                id,
                organizationId,
            },
        });
    }
}
export async function findIntegration(platform, externalId) {
    return prisma.integration.findFirst({
        where: {
            platform,
            externalId,
            verified: true,
        },
    });
}
