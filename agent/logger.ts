const isProd = process.env.NODE_ENV === "production";

export function log(level: string, message: string, meta?: any) {
  if (isProd) {
    console.log(JSON.stringify({ level, message, ...meta }));
  } else {
    console.log(`[${level}] ${message}`, meta || "");
  }
}

export const logger = {
  info: (msg: string, meta?: any) => log("info", msg, meta),
  error: (msg: string, meta?: any) => log("error", msg, meta)
};