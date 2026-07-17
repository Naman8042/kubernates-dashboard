import type{ Request,Response } from "express";

import type { AuthRequest }
from "../auth/auth.middleware.js";

import { IntegrationService }
from "./integration.service.js";

export class IntegrationController {
  static async createLinkCode(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const { platform } =
        req.body;

      const result =
        await IntegrationService.createLinkCode(
          req.user.organizationId,
          platform
        );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message:
          error.message,
      });
    }
  }

  static async verify(
    req:Request,
    res:Response
  ) {
    try {
      const {
        code,
        externalId,
        username,
      } = req.body;

      const result =
        await IntegrationService.verifyCode(
          code,
          externalId,
          username
        );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message:
          error.message,
      });
    }
  }

  static async list(
    req: AuthRequest,
    res: Response
  ) {
    const data =
      await IntegrationService.list(
        req.user.organizationId
      );

    res.json(data);
  }

  static async remove(
    req: AuthRequest,
    res: Response
  ) {
    await IntegrationService.remove(
      Number(req.params.id),
      req.user.organizationId
    );

    res.json({
      success: true,
    });
  }
}