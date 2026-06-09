import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", WalletSchema);
