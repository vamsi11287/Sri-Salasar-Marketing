import mongoose from "mongoose";

const sizeChartRowSchema = new mongoose.Schema({
  length: { type: String, required: true },
  width: { type: String, required: true },
  maxBundleDia: { type: String, default: "-" },
  tensileStrengthKg: { type: String, default: "-" },
  tensileStrengthLbs: { type: String, default: "-" },
  packSize: { type: String, default: "" }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  detail: { type: String, default: "" },
  description: { type: String, default: "" },
  price: { type: String, default: "" },
  moq: { type: String, default: "" },
  status: { type: String, enum: ["Active", "Out of Stock", "Draft"], default: "Active", index: true },
  image: { type: String, default: "" },
  images: [{ type: String }],
  cloudinaryPublicId: { type: String, default: "" },
  features: [{ type: String }],
  sizes: { type: String, default: "" },
  colors: [{ type: String }],
  material: { type: String, default: "" },
  packSize: { type: String, default: "" },
  loadRating: { type: String, default: "" },
  sizeChart: [sizeChartRowSchema],
  applications: { type: String, default: "" }
}, {
  timestamps: true
});

productSchema.index({ name: "text", detail: "text", description: "text", category: "text" });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
