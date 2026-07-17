import express from "express";
import { send } from "../websockets/sender.js";
import { DEFAULT_TOKEN } from "../config.js";
const router = express.Router();
export default function createDeploymentsRouter() {
    router.post("/scale", async (req, res, next) => {
        try {
            const { name, namespace, replicas } = req.body;
            const data = await send(DEFAULT_TOKEN, {
                type: "SCALE_DEPLOYMENT",
                payload: { name, namespace, replicas }
            });
            res.json(data);
        }
        catch (e) {
            next(e);
        }
    });
    router.post("/restart", async (req, res, next) => {
        try {
            const { name, namespace } = req.body;
            const data = await send(DEFAULT_TOKEN, {
                type: "RESTART_DEPLOYMENT",
                payload: { name, namespace }
            });
            res.json(data);
        }
        catch (e) {
            next(e);
        }
    });
    return router;
}
