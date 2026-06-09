import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["split", "commission", "release", "payout"], required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("Ledger", LedgerSchema);
