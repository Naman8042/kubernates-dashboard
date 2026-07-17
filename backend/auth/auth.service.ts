import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma.js";
import { generateToken } from "../utils/jwt.js";

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    organizationName: string
  ) {
    const existing =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existing) {
      throw new Error(
        "User already exists"
      );
    }

    const hash =
      await bcrypt.hash(
        password,
        10
      );

    const organization =
      await prisma.organization.create({
        data: {
          name:
            organizationName,
        },
      });

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hash,
          organizationId:
            organization.id,
        },
      });

    const token =
      generateToken({
        userId: user.id,
        organizationId:
          organization.id,
        role: user.role,
      });

    return {
      token,
      user,
    };
  }

  static async login(
    email: string,
    password: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!valid) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const token =
      generateToken({
        userId: user.id,
        organizationId:
          user.organizationId,
        role: user.role,
      });

    return {
      token,
      user,
    };
  }
}