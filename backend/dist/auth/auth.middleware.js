import { verifyToken } from "../utils/jwt.js";
export function authenticate(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
}
