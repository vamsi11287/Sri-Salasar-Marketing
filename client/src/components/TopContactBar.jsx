import React from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function TopContactBar({ onQuoteClick }) {
  return (
    <div className="top-contact-bar">
      <div className="top-contact-container">
        <div className="top-contact-info">
          <a href="tel:+916369021006" className="contact-link">
            <Phone size={14} className="top-icon phone-pulse" />
            <span className="contact-text">+91 63690 21006</span>
          </a>
          <span className="contact-divider">•</span>
          <a href="mailto:info@srisalasarmarketing.in" className="contact-link">
            <Mail size={14} className="top-icon" />
            <span className="contact-text">info@srisalasarmarketing.in</span>
          </a>
        </div>
        <div className="top-contact-actions">
          <span className="top-tagline">Pan-India Wholesale & Industrial Packaging Supplier</span>
          <button
            onClick={onQuoteClick}
            className="top-quote-btn"
            id="top-get-quote-btn"
          >
            Get a Quote <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
