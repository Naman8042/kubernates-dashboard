import { IntegrationService } from "./integration.service.js";
export class IntegrationController {
    static async createLinkCode(req, res) {
        try {
            const { platform } = req.body;
            const result = await IntegrationService.createLinkCode(req.user.organizationId, platform);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async verify(req, res) {
        try {
            const { code, externalId, username, } = req.body;
            const result = await IntegrationService.verifyCode(code, externalId, username);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async list(req, res) {
        const data = await IntegrationService.list(req.user.organizationId);
        res.json(data);
    }
    static async remove(req, res) {
        await IntegrationService.remove(Number(req.params.id), req.user.organizationId);
        res.json({
            success: true,
        });
    }
}
