import express from "express";
import { send } from "../websockets/sender.js";
import { DEFAULT_TOKEN } from "../config.js";
const router = express.Router();
export default function createReplicaSetRouter() {
    router.get("/", async (req, res, next) => {
        try {
            const data = await send(DEFAULT_TOKEN, { type: "GET_REPLICASETS" });
            res.json(data);
        }
        catch (e) {
            next(e);
        }
    });
    return router;
}
