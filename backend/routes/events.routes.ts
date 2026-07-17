import express, { Router } from "express";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";

const router: Router = express.Router();

export default function createEventsRouter(): Router {
  router.get(
    "/:clusterId",
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const cluster = await prisma.cluster.findUnique({
          where: {
            id: Number(req.params.clusterId),
          },
        });

        if (!cluster) {
          res.status(404).json({
            message: "Cluster not found",
          });
          return;
        }

        const data = await send(cluster.clusterToken, {
          type: "GET_EVENTS",
          payload: {
            namespace: req.query.namespace,
          },
        });

        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
}