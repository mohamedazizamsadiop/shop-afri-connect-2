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

// Automated endpoint: release pending funds for orders delivered more than X days ago
router.post("/auto-release", async (req, res) => {
  try {
    const days = parseInt(req.body.days || process.env.AUTO_RELEASE_DAYS || "7", 10);
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const Order = (await import("../models/Order.js")).default;
    const Product = (await import("../models/Product.js")).default;

    // Find orders that are delivered, deliveredAt <= cutoff, and not yet released
    const orders = await Order.find({ status: "delivered", deliveredAt: { $lte: cutoff }, released: false });
    const results = [];
    for (const order of orders) {
      // group amounts by seller
      const bySeller = {};
      for (const it of order.products) {
        const prod = await Product.findById(it.productId);
        if (!prod) continue;
        const sellerId = prod.sellerId.toString();
        const qty = it.quantity || 1;
        const sellerUnit = prod.sellerPrice;
        const sellerAmount = sellerUnit * qty;
        bySeller[sellerId] = (bySeller[sellerId] || 0) + sellerAmount;
      }

      // release funds per seller
      for (const [sellerId, amount] of Object.entries(bySeller)) {
        const wallet = await Wallet.findOne({ sellerId });
        if (!wallet || wallet.pendingBalance <= 0) continue;
        const releaseAmount = Math.min(amount, wallet.pendingBalance);
        wallet.availableBalance = (wallet.availableBalance || 0) + releaseAmount;
        wallet.pendingBalance = Math.max(0, wallet.pendingBalance - releaseAmount);
        await wallet.save();
        await Ledger.create({ type: "release", sellerId, amount: releaseAmount, description: `Auto-release for order ${order._id}` });
        results.push({ orderId: order._id, sellerId, amount: releaseAmount });
      }

      order.released = true;
      await order.save();
    }

    res.json({ ok: true, released: results.length, details: results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
