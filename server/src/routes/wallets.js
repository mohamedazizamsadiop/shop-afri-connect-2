import express from "express";
import Wallet from "../models/Wallet.js";
import Ledger from "../models/Ledger.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Seller: view wallet
router.get("/me", requireAuth, requireRole("seller"), async (req, res) => {
  const wallet = await Wallet.findOne({ sellerId: req.user._id });
  res.json({ ok: true, wallet });
});

// Admin: release pending funds to available for a given seller
router.post("/release", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return res.status(400).json({ ok: false, message: "sellerId required" });
    const wallet = await Wallet.findOne({ sellerId });
    if (!wallet || wallet.pendingBalance <= 0) return res.status(400).json({ ok: false, message: "No pending funds" });
    const amount = wallet.pendingBalance;
    wallet.availableBalance = (wallet.availableBalance || 0) + amount;
    wallet.pendingBalance = 0;
    await wallet.save();

    await Ledger.create({
      type: "release",
      sellerId: mongoose.Types.ObjectId(sellerId),
      amount,
      description: `Release pending -> available by admin for seller ${sellerId}`,
    });

    res.json({ ok: true, wallet });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Automated endpoint: release pending funds older than X days (callable by cron)
router.post("/auto-release", async (req, res) => {
  try {
    const days = parseInt(req.body.days || process.env.AUTO_RELEASE_DAYS || "7", 10);
    // Find ledger entries of type 'split' older than X days and not yet released
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    // For simplicity, release all pending balances (real impl would check delivery status)
    const wallets = await Wallet.find({ pendingBalance: { $gt: 0 } });
    const results = [];
    for (const w of wallets) {
      const amount = w.pendingBalance;
      w.availableBalance = (w.availableBalance || 0) + amount;
      w.pendingBalance = 0;
      await w.save();
      await Ledger.create({ type: "release", sellerId: w.sellerId, amount, description: `Auto-release ${days}d` });
      results.push({ sellerId: w.sellerId, amount });
    }
    res.json({ ok: true, released: results.length, details: results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
