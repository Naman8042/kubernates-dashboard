import express, { Router } from "express";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";

const router: Router = express.Router();

export default function createMetricsRouter(): Router {
  router.get(
    "/:clusterId",
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
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

        const metrics = await send(cluster.clusterToken, {
          type: "GET_METRICS",
        });

        res.type("text/plain");

        res.send(metrics);
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
}