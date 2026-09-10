// Charger les variables d'environnement AVANT tout import
import dotenv from "dotenv";
dotenv.config({ path: '.env' });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import stripeRoutes from "./routes/stripe.js";
import withdrawalsRoutes from "./routes/withdrawals.js";
import adminRoutes from "./routes/admin.js";
import walletsRoutes from "./routes/wallets.js";
import notificationsRoutes from "./routes/notifications.js";
import emailRoutes from "./routes/emails.js";

console.log('Environment variables loaded:', {
  MONGODB_URI: process.env.MONGODB_URI ? '***' : 'missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing',
});

const app = express();
// Autoriser dynamiquement les origines en fonction de l'env.
// En développement, on autorise l'origine demandée (utile pour IP/ports locaux).
const allowedOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://192.168.1.114:8080', 'http://192.168.1.116:8080', 'http://192.168.1.187:8080', 'http://192.168.1.41:8080'];

const corsOptions = {
  origin: process.env.NODE_ENV === 'development' ? true : allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/markethub";

// Tenter la connexion MongoDB (seulement si pas en mode test)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log("Server will continue running but database operations will fail");
      console.log("Please ensure MongoDB is running or configure a valid MONGODB_URI");
    });
}

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/withdrawals", withdrawalsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/emails", emailRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "MarketHub API" }));

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));
}

export default app;
