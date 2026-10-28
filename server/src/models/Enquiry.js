import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, default: "" },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  city: { type: String, default: "" },
  message: { type: String, default: "" },
  quantity: { type: String, default: "" },
  selectedProducts: [{ type: String }],
  status: {
    type: String,
    enum: ["New", "Contacted", "Quotation Sent", "Closed"],
    default: "New"
  },
  emailAlertSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
