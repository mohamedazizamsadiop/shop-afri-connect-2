import express from "express";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// list products
router.get("/", async (req, res) => {
  const products = await Product.find().limit(100);
  res.json({ ok: true, products });
});

// get product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ ok: false, message: "Not found" });
  res.json({ ok: true, product });
});

// create product (seller only)
router.post("/", requireAuth, requireRole("seller"), upload.array('images', 5), async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { name, description, sellerPrice, commission, stock, sku, category } = req.body;
    
    // Récupérer les URLs des images uploadées
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const commissionPercent = commission ?? parseFloat(process.env.DEFAULT_COMMISSION_PERCENT || "15");
    const commissionAmount = (sellerPrice * commissionPercent) / 100;
    const finalPrice = sellerPrice + commissionAmount;
    const product = new Product({ sellerId, name, description, sellerPrice, commission: commissionPercent, finalPrice, stock, sku, images, category });
    await product.save();
    res.status(201).json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// update product (seller only)
router.put("/:id", requireAuth, requireRole("seller"), upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, message: "Not found" });
    if (product.sellerId.toString() !== req.user._id.toString()) return res.status(403).json({ ok: false, message: "Forbidden" });
    
    // Mettre à jour les champs
    Object.assign(product, req.body);
    
    // Ajouter les nouvelles images si uploadées
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      product.images = [...product.images, ...newImages];
    }
    
    if (req.body.sellerPrice) {
      const commissionAmount = (product.sellerPrice * (product.commission || parseFloat(process.env.DEFAULT_COMMISSION_PERCENT || "15"))) / 100;
      product.finalPrice = product.sellerPrice + commissionAmount;
    }
    await product.save();
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// delete product (seller only)
router.delete("/:id", requireAuth, requireRole("seller"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, message: "Not found" });
    if (product.sellerId.toString() !== req.user._id.toString()) return res.status(403).json({ ok: false, message: "Forbidden" });
    await product.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
