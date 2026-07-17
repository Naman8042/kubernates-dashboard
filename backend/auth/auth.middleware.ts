import type{
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest
  extends Request {
  user?: any;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authenticated",
      });
    }

    const payload =
      verifyToken(token);

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Invalid token",
    });
  }
}