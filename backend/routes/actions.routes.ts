import express, { Router, }from "express";
import type {Request, Response, NextFunction } from 'express'
import { send } from "../websockets/sender.js";
import { DEFAULT_TOKEN } from "../config.js";

const router: Router = express.Router();

export default function createDeploymentsRouter(): Router {

  router.post("/scale", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, namespace, replicas } = req.body;

      const data = await send(DEFAULT_TOKEN, {
        type: "SCALE_DEPLOYMENT",
        payload: { name, namespace, replicas }
      });

      res.json(data);
    } catch (e) { 
      next(e); 
    }
  });

  router.post("/restart", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, namespace } = req.body;

      const data = await send(DEFAULT_TOKEN, {
        type: "RESTART_DEPLOYMENT",
        payload: { name, namespace }
      });

      res.json(data);
    } catch (e) { 
      next(e); 
    }
  });

  return router;
}
