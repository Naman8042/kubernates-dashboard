import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
const router = Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", authenticate, AuthController.getCurrentUser);
export default router;
