export default function auth(req, res, next) {
    // If you decide to un-comment and enforce API key security later:
    // if (req.headers["x-api-key"] !== API_KEY) {
    //   res.status(401).json({ error: "Unauthorized" });
    //   return;
    // }
    next();
}
