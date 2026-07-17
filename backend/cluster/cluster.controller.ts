import type { Response } from "express";

import type{
  AuthRequest,
} from "../auth/auth.middleware.js";

import {
  ClusterService,
} from "./cluster.service.js";

export class ClusterController {
  static async create(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const { name } = req.body;

      const cluster =
        await ClusterService.createCluster(
          req.user.organizationId,
          name
        );

      res.json(cluster);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async list(
    req: AuthRequest,
    res: Response
  ) {
    const clusters =
      await ClusterService.getClusters(
        req.user.organizationId
      );

    res.json(clusters);
  }

  static async getOne(
  req: AuthRequest,
  res: Response
) {
  const cluster =
    await ClusterService.getClusterById(
      Number(req.params.id),
      req.user.organizationId
    );

  if (!cluster) {
    return res.status(404).json({
      message: "Cluster not found",
    });
  }

  res.json(cluster);
}

static async delete(
  req: AuthRequest,
  res: Response
) {
  await ClusterService.deleteCluster(
    Number(req.params.id),
    req.user.organizationId
  );

  res.json({
    success: true,
  });
}
}