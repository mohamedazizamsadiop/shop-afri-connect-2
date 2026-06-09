import express from "express";
import Seller from "../models/Seller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Validate (verify) a seller account
router.post("/validate-seller", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { sellerId, verified = true } = req.body;
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ ok: false, message: "Seller not found" });
    seller.verified = !!verified;
    await seller.save();
    res.json({ ok: true, seller });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
