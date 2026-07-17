import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
export async function getPods(req, res) {
    const clusterId = Number(req.params.id);
    const cluster = await prisma.cluster.findUnique({
        where: {
            id: clusterId,
        },
    });
    if (!cluster) {
        return res.status(404).json({
            message: "Cluster not found",
        });
    }
    const pods = await send(cluster.clusterToken, {
        type: "GET_PODS",
    });
    res.json(pods);
}
