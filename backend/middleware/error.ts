import type { Request, Response,NextFunction} from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next:NextFunction
): void {
  console.error(err);

  const errorMessage = err instanceof Error ? err.message : String(err);

  res.status(500).json({ 
    error: errorMessage 
  });
}
