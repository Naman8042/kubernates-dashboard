import { ClusterService, } from "./cluster.service.js";
export class ClusterController {
    static async create(req, res) {
        try {
            const { name } = req.body;
            const cluster = await ClusterService.createCluster(req.user.organizationId, name);
            res.json(cluster);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async list(req, res) {
        const clusters = await ClusterService.getClusters(req.user.organizationId);
        res.json(clusters);
    }
    static async getOne(req, res) {
        const cluster = await ClusterService.getClusterById(Number(req.params.id), req.user.organizationId);
        if (!cluster) {
            return res.status(404).json({
                message: "Cluster not found",
            });
        }
        res.json(cluster);
    }
    static async delete(req, res) {
        await ClusterService.deleteCluster(Number(req.params.id), req.user.organizationId);
        res.json({
            success: true,
        });
    }
}
