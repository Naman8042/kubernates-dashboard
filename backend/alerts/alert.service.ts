import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";

class AlertController {
  async getAlerts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const clusterId = Number(req.params.clusterId);

      const cluster = await prisma.cluster.findUnique({
        where: {
          id: clusterId,
        },
      });

      if (!cluster) {
        res.status(404).json({
          message: "Cluster not found",
        });

        return;
      }

      const alerts = await send(cluster.clusterToken, {
        type: "GET_ALERTS",
      });

      res.json(alerts);
    } catch (err) {
      next(err);
    }
  }
}

export default new AlertController();