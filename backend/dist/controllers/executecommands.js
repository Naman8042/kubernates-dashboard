import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
export async function executeKubectlCommand(req, res) {
    try {
        const { clusterId } = req.params;
        const { command } = req.body;
        if (!command) {
            return res.status(400).json({
                error: "Command is required",
            });
        }
        const cluster = await prisma.cluster.findUnique({
            where: {
                id: Number(clusterId),
            },
        });
        if (!cluster) {
            return res.status(404).json({
                error: "Cluster not found",
            });
        }
        const result = await send(cluster.clusterToken, {
            type: "KUBECTL",
            payload: {
                command,
            },
        });
        return res.json({
            success: true,
            command,
            output: result,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}
