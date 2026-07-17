import express from "express";
import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
const router = express.Router();
export default function createMetricsRouter() {
    router.get("/:clusterId", async (req, res, next) => {
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
        }
        catch (e) {
            next(e);
        }
    });
    return router;
}
