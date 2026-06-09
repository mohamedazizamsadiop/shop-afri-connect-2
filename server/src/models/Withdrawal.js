import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "paid"], default: "pending" },
    method: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", WithdrawalSchema);
