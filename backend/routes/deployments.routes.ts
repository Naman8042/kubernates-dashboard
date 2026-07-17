import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import { send } from "../websockets/sender.js";
import { prisma } from "../prisma/prisma.js";

const router: Router = express.Router();

export default function createGetDeploymentsRouter(): Router {
  router.get(
    "/:clusterId",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        const data = await send(cluster.clusterToken, {
          type: "GET_DEPLOYMENTS",
        });

        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post(
    "/:clusterId",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
          type: "DESCRIBE_DEPLOYMENT",
          payload: {
            namespace: req.body.namespace,
            deployment: req.body.deployment,
          },
        });

        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post(
    "/deployment/:clusterId",
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
          type: "RESTART_DEPLOYMENT",
          payload: {
            namespace: req.body.namespace,
            deployment: req.body.deployment,
          },
        });

        res.json(data);
      } catch (e) {
        next(e);
      }
    },)
  return router;
}
