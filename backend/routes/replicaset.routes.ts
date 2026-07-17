import express, { Router, }from "express";
import type {Request, Response, NextFunction } from 'express'
import { send } from "../websockets/sender.js";
import { DEFAULT_TOKEN } from "../config.js";

const router: Router = express.Router();

export default function createReplicaSetRouter(): Router {
  router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await send(DEFAULT_TOKEN, { type: "GET_REPLICASETS" });
      res.json(data);
    } catch (e) { 
      next(e); 
    }
  });
  
  return router;
}
