import { dataStore } from "../services/dataStore.js";
import { sendEnquiryEmailAlert } from "../services/emailService.js";

// POST /api/enquiries (Public)
export const createEnquiry = async (req, res) => {
  try {
    const { fullName, companyName, phone, email, city, message, quantity, selectedProducts } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: "Full Name and Phone Number are required." });
    }

    const enquiry = await dataStore.createEnquiry({
      fullName,
      companyName,
      phone,
      email,
      city,
      message,
      quantity: quantity || "",
      selectedProducts: Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts].filter(Boolean),
      status: "New"
    });

    // Send email alert asynchronously (does not block HTTP response)
    sendEnquiryEmailAlert(enquiry).catch(err => {
      console.warn("Non-fatal email alert issue:", err.message);
    });

    // Generate pre-formatted WhatsApp enquiry message
    const prodsText = Array.isArray(selectedProducts) && selectedProducts.length > 0 
      ? selectedProducts.join(", ") 
      : "Industrial Packaging Supplies";
      
    const waText = `Hello Sri Salasar Marketing, I am ${fullName}${companyName ? ` from ${companyName}` : ""}. I submitted an enquiry for *${prodsText}*${quantity ? ` (Quantity: ${quantity})` : ""}.${city ? ` City: ${city}.` : ""} Please share quotation.`;
    const waUrl = `https://wa.me/${process.env.WHATSAPP_PRIMARY || "916369021006"}?text=${encodeURIComponent(waText)}`;

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully! Our sales team has been notified via email & dashboard.",
      data: enquiry,
      whatsAppUrl: waUrl
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ success: false, message: "Error submitting enquiry" });
  }
};

// GET /api/enquiries (Admin)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await dataStore.getEnquiries();
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading enquiries" });
  }
};

// PATCH /api/enquiries/:id/status (Admin)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await dataStore.updateEnquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, message: "Enquiry status updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};
