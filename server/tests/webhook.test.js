import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/index.js";

let mongod;

jest.setTimeout(30000);

beforeAll(async () => {
  if (process.env.TEST_MONGODB_URI) {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    return;
  }
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

test("webhook payment_intent.succeeded credits pending and creates ledger entries", async () => {
  const User = (await import("../src/models/User.js")).default;
  const Product = (await import("../src/models/Product.js")).default;
  const Seller = (await import("../src/models/Seller.js")).default;
  const Wallet = (await import("../src/models/Wallet.js")).default;
  const Order = (await import("../src/models/Order.js")).default;
  const Ledger = (await import("../src/models/Ledger.js")).default;

  // create seller and product
  const user = await User.create({ name: "Seller", email: "s2@example.com", password: "pass", role: "seller" });
  const seller = await Seller.create({ userId: user._id, shopName: "Shop2" });
  const product = await Product.create({ sellerId: seller._id, name: "P2", sellerPrice: 50, finalPrice: 57.5 });

  // create order and simulate webhook event
  const order = await Order.create({ customerId: user._id, products: [{ productId: product._id, quantity: 2, price: product.finalPrice }], totalAmount: 115, status: "created" });

  const pi = {
    id: "pi_test_1",
    metadata: { orderId: order._id.toString() },
  };

  const event = { type: "payment_intent.succeeded", data: { object: pi } };
  const res = await request(app).post("/api/stripe/webhook").send(event).set("Content-Type", "application/json");
  expect(res.status).toBe(200);
  const w = await Wallet.findOne({ sellerId: seller._id });
  expect(w.pendingBalance).toBe(100); // 50 * 2
  const ledger = await Ledger.find({ orderId: order._id });
  expect(ledger.length).toBeGreaterThanOrEqual(1);
});
