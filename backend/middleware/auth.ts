import type { Request, Response, NextFunction } from "express";
import { API_KEY } from "../config.js";

export default function auth(
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  // If you decide to un-comment and enforce API key security later:
  // if (req.headers["x-api-key"] !== API_KEY) {
  //   res.status(401).json({ error: "Unauthorized" });
  //   return;
  // }
  
  next();
}
