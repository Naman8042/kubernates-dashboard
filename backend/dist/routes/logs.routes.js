import express from "express";
import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
const router = express.Router();
export default function createLogsRouter() {
    router.get("/:clusterId", async (req, res, next) => {
        try {
            const clusterId = Number(req.params.clusterId);
            const { namespace, pod, } = req.query;
            if (!namespace || !pod) {
                res.status(400).json({
                    message: "namespace and pod are required",
                });
                return;
            }
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
            if (cluster.status !==
                "online") {
                res.status(400).json({
                    message: "Cluster offline",
                });
                return;
            }
            const logs = await send(cluster.clusterToken, {
                type: "GET_LOGS",
                payload: {
                    namespace: namespace,
                    podName: pod,
                },
            });
            res.json(logs);
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
