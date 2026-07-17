import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "super-secret-key";

interface JwtPayload {
  userId: number;
  organizationId: number;
  role: string;
}

export function generateToken(
  payload: JwtPayload
): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(
  token: string
): JwtPayload {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JwtPayload;
}

export function decodeToken(
  token: string
) {
  return jwt.decode(token);
}