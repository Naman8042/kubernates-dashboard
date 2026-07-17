function log(level: string, message: string, meta: any): void {
  console.log(
    JSON.stringify({
      level,
      message,
      timeStamp: new Date().toISOString(), // Fixed bug: added parentheses to execute the function
      meta
    })
  );
}

export const info = (msg: string, meta?: any): void => log("info", msg, meta);
export const error = (msg: string, meta?: any): void => log("error", msg, meta);
