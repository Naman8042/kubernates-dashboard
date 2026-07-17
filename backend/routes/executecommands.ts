import { Router } from "express";
import { executeKubectlCommand } from "../controllers/executecommands.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.post(
  "/kubectl/:clusterId",
  authenticate,
  executeKubectlCommand
);

export default router;