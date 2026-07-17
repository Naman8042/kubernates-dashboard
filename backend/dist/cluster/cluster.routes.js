import { Router } from "express";
import { ClusterController, } from "./cluster.controller.js";
import { authenticate, } from "../auth/auth.middleware.js";
const router = Router();
router.get("/", authenticate, ClusterController.list);
router.get("/:id", authenticate, ClusterController.getOne);
router.post("/", authenticate, ClusterController.create);
router.delete("/:id", authenticate, ClusterController.delete);
export default router;
