import express from "express";
import alertController from "./alert.service.js";
const router = express.Router();
router.get("/:clusterId", alertController.getAlerts);
export default router;
