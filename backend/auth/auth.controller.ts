import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { prisma } from "../prisma/prisma.js";
import type {AuthRequest} from "./auth.middleware.js"

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, organizationName } = req.body;

      const result = await AuthService.register(
        name,
        email,
        password,
        organizationName,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");

    return res.json({
      success: true,
    });
  }

  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      console.log(req)
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.type === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        user: result.user,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}
