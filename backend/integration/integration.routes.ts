import { Router } from "express";

import {
  authenticate,
} from "../auth/auth.middleware.js";

import {
  IntegrationController,
} from "./integration.controller.js";

const router = Router();

router.post(
  "/link-code",
  authenticate,
  IntegrationController.createLinkCode
);

router.post(
  "/verify",
  IntegrationController.verify
);

router.get(
  "/",
  authenticate,
  IntegrationController.list
);

router.delete(
  "/:id",
  authenticate,
  IntegrationController.remove
);

export default router;