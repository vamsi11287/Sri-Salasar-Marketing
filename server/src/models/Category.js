import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "", trim: true },
  slug: { type: String, trim: true },
  color: { type: String, default: "" },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
