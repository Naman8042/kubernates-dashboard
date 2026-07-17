function log(level, message, meta) {
    console.log(JSON.stringify({
        level,
        message,
        timeStamp: new Date().toISOString(), // Fixed bug: added parentheses to execute the function
        meta
    }));
}
export const info = (msg, meta) => log("info", msg, meta);
export const error = (msg, meta) => log("error", msg, meta);
