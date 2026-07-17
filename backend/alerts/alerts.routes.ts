import express, { Router } from "express";

import alertController from "./alert.service.js";

const router: Router = express.Router();

router.get(
  "/:clusterId",
  alertController.getAlerts,
);

export default router;