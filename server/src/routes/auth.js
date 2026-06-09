import express from "express";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, message: "Email already in use" });
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ ok: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ ok: false, message: "Invalid credentials" });

    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });

    // store refresh token
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({ ok: true, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ ok: false, message: "Missing refresh token" });
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid refresh token" });
    }
    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ ok: false, message: "Refresh token not recognized" });
    }
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    res.json({ ok: true, accessToken });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Logout: remove a refresh token
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ ok: false, message: "Missing refresh token" });
    const payload = verifyToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.json({ ok: true });
    user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== refreshToken);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
