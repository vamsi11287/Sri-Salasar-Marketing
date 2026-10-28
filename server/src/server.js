import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Sri Salasar Marketing B2B API"
  });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Sri Salasar Marketing API Server running on port ${PORT}`);
      console.log(`📡 Base URL: http://localhost:${PORT}/api`);
      console.log(`☁️ Cloud Storage: Cloudinary CDN`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error("[Startup error] Could not connect to MongoDB; API server was not started.", error);
    process.exitCode = 1;
  }
};

startServer();
