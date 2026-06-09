import express from "express";
import Stripe from "stripe";
import Seller from "../models/Seller.js";

const stripe = new Stripe(process.env.STRIPE_SECRET || "", { apiVersion: "2022-11-15" });
const router = express.Router();

// Create a checkout session for seller subscription
router.post("/create-subscription", async (req, res) => {
  try {
    const { email, priceId, sellerId } = req.body;
    if (!priceId) return res.status(400).json({ ok: false, message: "Missing priceId" });
    // create customer
    const customer = await stripe.customers.create({ email, metadata: { sellerId } });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: req.body.success_url || "http://localhost:3000/success",
      cancel_url: req.body.cancel_url || "http://localhost:3000/cancel",
      metadata: { sellerId },
    });

    // store subscription info later via webhook
    res.json({ ok: true, url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Webhook endpoint (simple handler)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    let event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }


    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // If session is for subscription, update seller with subscription info
      try {
        const sellerId = session.metadata && session.metadata.sellerId;
        if (sellerId) {
          const seller = await Seller.findById(sellerId);
          if (seller) {
            seller.stripeCustomerId = session.customer;
            // subscription id sometimes available on session.subscription
            if (session.subscription) seller.stripeSubscriptionId = session.subscription;
            seller.subscriptionStatus = "active";
            await seller.save();
          }
        }
      } catch (err) {
        console.error("Error updating seller from session", err.message);
      }
    }

    // Payment succeeded for one-time payments
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const metadata = pi.metadata || {};
      const orderId = metadata.orderId;
      if (orderId) {
        try {
          const Order = (await import("../models/Order.js")).default;
          const Product = (await import("../models/Product.js")).default;
          const Wallet = (await import("../models/Wallet.js")).default;
          const order = await Order.findById(orderId);
          if (order) {
            order.status = "paid";
            order.paymentIntentId = pi.id;
            await order.save();

            // For each product in the order, credit seller pending balance (escrow)
            for (const it of order.products) {
              const prod = await Product.findById(it.productId);
              if (!prod) continue;
              const sellerId = prod.sellerId;
              const qty = it.quantity || 1;
              const sellerAmount = prod.sellerPrice * qty;
              const commissionPercent = prod.commission || parseFloat(process.env.DEFAULT_COMMISSION_PERCENT || "15");
              const commissionAmount = (prod.sellerPrice * commissionPercent / 100) * qty;

              // Update or create wallet
              await Wallet.findOneAndUpdate(
                { sellerId },
                { $inc: { pendingBalance: sellerAmount, availableBalance: 0 } },
                { upsert: true }
              );

              // Here commissionAmount is retained by platform; record could be added to ledger (omitted)
            }
          }
        } catch (err) {
          console.error("Error processing payment_intent.succeeded webhook:", err.message);
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
