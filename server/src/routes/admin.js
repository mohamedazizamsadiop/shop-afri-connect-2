import express from "express";
import Seller from "../models/Seller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Ledger from "../models/Ledger.js";

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

// Ledger query for admin: filter by date range, type, sellerId
router.get("/ledger", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { startDate, endDate, type, sellerId, page = 1, limit = 50 } = req.query;
    const q = {};
    if (type) q.type = type;
    if (sellerId) q.sellerId = sellerId;
    if (startDate || endDate) {
      q.createdAt = {};
      if (startDate) q.createdAt.$gte = new Date(startDate);
      if (endDate) q.createdAt.$lte = new Date(endDate);
    }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const items = await Ledger.find(q).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10));
    const total = await Ledger.countDocuments(q);
    res.json({ ok: true, total, items });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
