import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    subscription: {
      plan: { type: String, enum: ["basic", "pro", "enterprise"], default: "basic" },
      status: { type: String, enum: ["active", "past_due", "cancelled"], default: "active" },
      nextBillingDate: Date,
    },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", SellerSchema);
