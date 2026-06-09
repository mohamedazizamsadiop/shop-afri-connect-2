import express from "express";
import Withdrawal from "../models/Withdrawal.js";
import Wallet from "../models/Wallet.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Seller requests withdrawal
router.post("/request", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { amount, method } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ ok: false, message: "Invalid amount" });

    // check wallet
    const wallet = await Wallet.findOne({ sellerId });
    if (!wallet || wallet.availableBalance < amount) return res.status(400).json({ ok: false, message: "Insufficient available balance" });

    const withdrawal = new Withdrawal({ sellerId, amount, method, status: "pending" });
    await withdrawal.save();
    res.status(201).json({ ok: true, withdrawal });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin list withdrawal requests
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const list = await Withdrawal.find().sort({ createdAt: -1 }).limit(200);
  res.json({ ok: true, list });
});

// Admin approve/reject
router.post("/:id/approve", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) return res.status(404).json({ ok: false, message: "Not found" });
    // deduct from wallet availableBalance
    const wallet = await Wallet.findOne({ sellerId: w.sellerId });
    if (!wallet || wallet.availableBalance < w.amount) return res.status(400).json({ ok: false, message: "Insufficient funds" });
    wallet.availableBalance -= w.amount;
    await wallet.save();
    w.status = "approved";
    await w.save();
    res.json({ ok: true, withdrawal: w });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/:id/reject", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) return res.status(404).json({ ok: false, message: "Not found" });
    w.status = "rejected";
    await w.save();
    res.json({ ok: true, withdrawal: w });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
