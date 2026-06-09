import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true },
    description: String,
    sellerPrice: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: String,
    images: [String],
    category: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
