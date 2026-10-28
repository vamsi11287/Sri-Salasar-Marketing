import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Mail,
  ShieldCheck
} from "lucide-react";
import { api } from "../services/api";

export const WHATSAPP_NUMBER = "916369021006";

export function getWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function QuoteSection({
  products = [],
  onNewEnquirySubmitted,
  prefilledProduct
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    city: "",
    message: prefilledProduct ? `Enquiring for ${prefilledProduct.name}` : "",
    quantity: "Standard Batch (50 - 200 units)",
    selectedProducts: prefilledProduct ? [prefilledProduct.name] : []
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [whatsAppRedirectUrl, setWhatsAppRedirectUrl] = useState("");

  const productOptions = Array.from(
    new Set(products.map((product) => product.name).filter(Boolean))
  );

  const handleProductToggle = (prod) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(prod);
      if (exists) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter((p) => p !== prod)
        };
      } else {
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, prod]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your Full Name and Mobile Phone Number.");
      return;
    }

    setLoading(true);
    setSubmissionError("");

    try {
      const res = await api.submitEnquiry({
        ...formData,
        timestamp: new Date().toISOString()
      });

      setLoading(false);
      setSubmitted(true);

      // Pre-calculated WhatsApp link
      const waUrl =
        res.whatsAppUrl ||
        getWhatsAppUrl(
          `Hello Sri Salasar Marketing, I submitted a bulk quote enquiry for: ${formData.selectedProducts.join(
            ", "
          )} (Quantity: ${formData.quantity}). Please share best rates.`
        );
      setWhatsAppRedirectUrl(waUrl);

      if (onNewEnquirySubmitted) {
        onNewEnquirySubmitted(res.data || formData);
      }
    } catch (err) {
      setLoading(false);
      setSubmissionError(err.message || "Could not submit your enquiry. Please try again.");
    }
  };

  return (
    <section className="quote-section-wrapper" id="quote-section">
      <div className="section-container">
        <div className="quote-card-container">
          {/* Left Column: Value Prop */}
          <div className="quote-intro-col">
            <span className="quote-eyebrow">INSTANT B2B QUOTATION DESK</span>
            <h2 className="quote-title">
              Request Your <span className="title-orange">Custom Bulk Quote</span>
            </h2>
            <p className="quote-desc">
              Get manufacturer-direct pricing, ready-stock confirmation, and freight estimations
              delivered directly to your WhatsApp and email.
            </p>

            <div className="quote-guarantee-list">
              <div className="quote-guarantee-item">
                <Clock size={18} className="quote-guar-icon" />
                <div>
                  <strong>30-Minute Turnaround</strong>
                  <span>Fast response during working hours (9:30 AM - 7:30 PM).</span>
                </div>
              </div>

              <div className="quote-guarantee-item">
                <ShieldCheck size={18} className="quote-guar-icon" />
                <div>
                  <strong>Virgin Grade Guaranteed</strong>
                  <span>TDS reports and batch test certificates supplied.</span>
                </div>
              </div>

              <div className="quote-guarantee-item">
                <PhoneCall size={18} className="quote-guar-icon" />
                <div>
                  <strong>Dedicated Account Manager</strong>
                  <span>Direct phone line for repeat industrial contracts.</span>
                </div>
              </div>
            </div>

            <div className="quote-direct-wa-box">
              <div className="wa-box-icon">
                <MessageCircle size={24} />
              </div>
              <div className="wa-box-text">
                <strong>Need immediate pricing right now?</strong>
                <p>Chat directly with our Chennai sales team on WhatsApp.</p>
              </div>
              <a
                href={getWhatsAppUrl("Hello Sri Salasar Marketing, I need quick pricing for bulk supplies.")}
                target="_blank"
                rel="noreferrer"
                className="wa-box-btn"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="quote-form-col">
            {submitted ? (
              <div className="quote-success-screen animate-fadeIn">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={48} className="success-green-tick" />
                </div>
                <h3>Quote Request Dispatched!</h3>
                <p>
                  Thank you <strong>{formData.fullName}</strong>. An automated notification alert has
                  been dispatched to our sales team and email inbox.
                </p>

                <div className="alert-dispatched-box">
                  <div className="alert-row">
                    <Mail size={16} />
                    <span>Email notification sent to sales desk</span>
                  </div>
                  <div className="alert-row">
                    <MessageCircle size={16} />
                    <span>WhatsApp priority routing ready</span>
                  </div>
                </div>

                {whatsAppRedirectUrl && (
                  <div className="success-actions">
                    <a
                      href={whatsAppRedirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="success-wa-cta-btn"
                    >
                      <MessageCircle size={18} />
                      <span>Continue Conversation on WhatsApp</span>
                    </a>
                  </div>
                )}

                <button
                  className="submit-another-btn"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="quote-actual-form">
                <h3 className="form-inner-title">Tell Us Your Requirements</h3>
                {submissionError && <p role="alert">{submissionError}</p>}

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. K. Venkatesh"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Company / Firm Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Electricals Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Mobile Number (for WhatsApp quote) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98410 00000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>City &amp; State</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Tamil Nadu"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Select Required Products:</label>
                  <div className="product-checkbox-grid">
                    {productOptions.length > 0 ? (
                      productOptions.map((prod) => {
                        const isChecked = formData.selectedProducts.includes(prod);
                        return (
                          <label
                            key={prod}
                            className={`product-pill-checkbox ${
                              isChecked ? "checked" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleProductToggle(prod)}
                            />
                            <span>{prod}</span>
                          </label>
                        );
                      })
                    ) : (
                      <p>Products are currently unavailable. Please try again later.</p>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Estimated Quantity Batch:</label>
                    <select
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    >
                      <option>Sample Pack (Trial)</option>
                      <option>Standard Batch (50 - 200 units / cartons)</option>
                      <option>Bulk Commercial (200 - 1,000 units / cartons)</option>
                      <option>High Volume Industrial Contract (1,000+ units)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Email Address (for formal PDF quote)</label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Additional Notes / Specific Sizes &amp; Specifications:</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 200mm UV black ties with TDS sheet. Also require custom printed 48mm packaging tape."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="quote-submit-btn"
                  id="quote-submit-btn"
                >
                  {loading ? (
                    <span>Submitting &amp; Sending Alerts...</span>
                  ) : (
                    <>
                      <span>Send Enquiry &amp; Receive Quotation</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
