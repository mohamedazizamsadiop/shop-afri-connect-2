import express from "express";
import User from "../models/User.js";

const router = express.Router();

// health
router.get("/", (req, res) => res.json({ ok: true, msg: "users route" }));

// create user (signup - simplified)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "client" } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ ok: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
