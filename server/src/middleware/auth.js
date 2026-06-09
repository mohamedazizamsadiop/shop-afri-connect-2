import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ ok: false, message: "Missing token" });
    const token = auth.split(" ")[1];
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ ok: false, message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Unauthorized", error: err.message });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Missing user" });
    if (req.user.role !== role) return res.status(403).json({ ok: false, message: "Forbidden" });
    next();
  };
}
