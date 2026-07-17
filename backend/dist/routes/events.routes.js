import express from "express";
import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
const router = express.Router();
export default function createEventsRouter() {
    router.get("/:clusterId", async (req, res, next) => {
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
        }
        catch (e) {
            next(e);
        }
    });
    return router;
}
