import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Catalogue", "TDS", "Certificate"],
    default: "Catalogue"
  },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  cloudinaryPublicId: { type: String, default: "" },
  fileSize: { type: String, default: "" },
  version: { type: String, default: "" },
  description: { type: String, default: "" },
  isCurrentMasterCatalogue: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
