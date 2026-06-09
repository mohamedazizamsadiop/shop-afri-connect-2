import request from "supertest";
import { jest } from "@jest/globals";
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

test("auto-release moves pending to available for delivered orders", async () => {
  const User = (await import("../src/models/User.js")).default;
  const Product = (await import("../src/models/Product.js")).default;
  const Seller = (await import("../src/models/Seller.js")).default;
  const Wallet = (await import("../src/models/Wallet.js")).default;
  const Order = (await import("../src/models/Order.js")).default;

  // create seller and product
  const user = await User.create({ name: "Seller", email: "s@example.com", password: "pass", role: "seller" });
  const seller = await Seller.create({ userId: user._id, shopName: "Shop" });
  const product = await Product.create({ sellerId: seller._id, name: "P", sellerPrice: 100, finalPrice: 115 });

  // create order delivered 10 days ago and wallet pending amount
  const tenDays = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const order = await Order.create({ customerId: user._id, products: [{ productId: product._id, quantity: 1, price: product.finalPrice }], totalAmount: 115, status: "delivered", deliveredAt: tenDays });
  await Wallet.create({ sellerId: seller._id, pendingBalance: 100, availableBalance: 0 });

  // call auto-release with days=7
  const res = await request(app).post("/api/wallets/auto-release").send({ days: 7 });
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);

  const w = await Wallet.findOne({ sellerId: seller._id });
  expect(w.availableBalance).toBe(100);
  expect(w.pendingBalance).toBe(0);

  const o = await Order.findById(order._id);
  expect(o.released).toBe(true);
});
