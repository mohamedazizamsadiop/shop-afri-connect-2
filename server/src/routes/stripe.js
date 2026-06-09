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
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: req.body.success_url || "http://localhost:3000/success",
      cancel_url: req.body.cancel_url || "http://localhost:3000/cancel",
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
      // handle subscription activation: find seller by metadata if set
      // For now, we log
      console.log("Checkout session completed", session.id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
