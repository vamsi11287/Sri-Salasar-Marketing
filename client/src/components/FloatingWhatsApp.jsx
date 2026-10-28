import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppUrl } from "./QuoteSection";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="floating-whatsapp-container">
      {showTooltip && (
        <div className="whatsapp-floating-tooltip animate-fadeIn">
          <div className="tooltip-text">
            <strong>Need Instant Pricing?</strong>
            <span>Chat on WhatsApp now</span>
          </div>
          <button
            className="tooltip-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <a
        href={getWhatsAppUrl("Hello Sri Salasar Marketing, I want to enquire about bulk order pricing.")}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat with Sri Salasar Marketing on WhatsApp"
        id="floating-whatsapp-trigger"
      >
        <span className="whatsapp-pulse-ring" />
        <MessageCircle size={28} className="whatsapp-icon" />
      </a>
    </div>
  );
}
