import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET || "", { apiVersion: "2022-11-15" });

const router = express.Router();

// create order (customer)
router.post("/", requireAuth, async (req, res) => {
  try {
    const customerId = req.user._id;
    const { items, paymentMethod = "stripe" } = req.body; // items: [{productId, quantity}]
    if (!items || !items.length) return res.status(400).json({ ok: false, message: "No items" });
    let total = 0;
    const products = [];
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(400).json({ ok: false, message: "Invalid product" });
      products.push({ productId: p._id, quantity: it.quantity, price: p.finalPrice });
      total += p.finalPrice * (it.quantity || 1);
    }

    // create payment intent with Stripe if configured
    let paymentIntent = null;
    if (process.env.STRIPE_SECRET) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "eur",
        metadata: { customerId: customerId.toString() },
      });
    }

    const order = new Order({ customerId, products, totalAmount: total, status: paymentIntent ? "created" : "paid" });
    await order.save();

    res.status(201).json({ ok: true, order, payment: paymentIntent ? { client_secret: paymentIntent.client_secret } : null });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// get orders for current user
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).limit(100);
  res.json({ ok: true, orders });
});

export default router;
