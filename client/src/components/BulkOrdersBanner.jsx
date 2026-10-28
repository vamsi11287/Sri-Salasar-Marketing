import React from "react";
import {
  Boxes,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight
} from "lucide-react";

export default function BulkOrdersBanner({ onQuoteClick }) {
  const trustFeatures = [
    {
      icon: Boxes,
      title: "Wide Product Range",
      subtitle: "Over 500+ sizes & SKUs in ready stock"
    },
    {
      icon: ShieldCheck,
      title: "Assured Quality",
      subtitle: "Strict batch testing & virgin materials"
    },
    {
      icon: Truck,
      title: "Pan India Supply",
      subtitle: "Fast logistics to 28+ states & UTs"
    },
    {
      icon: Headphones,
      title: "Dedicated Customer Support",
      subtitle: "Direct sales desk & instant WhatsApp help"
    }
  ];

  return (
    <section className="bulk-order-banner-section">
      <div className="bulk-banner-container">
        {/* Navy Features Side */}
        <div className="bulk-features-side">
          <div className="bulk-features-grid">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bulk-feature-cell">
                  <div className="bulk-icon-wrapper">
                    <Icon size={24} />
                  </div>
                  <div className="bulk-text-wrapper">
                    <h4 className="bulk-feature-heading">{item.title}</h4>
                    <p className="bulk-feature-sub">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orange Promo Block Side */}
        <div className="bulk-cta-side">
          <div className="bulk-cta-inner">
            <span className="bulk-tag">B2B &amp; WHOLESALE SPECIAL</span>
            <h3 className="bulk-cta-title">Need Bulk Orders?</h3>
            <p className="bulk-cta-sub">
              Get the best prices for your business requirements.
            </p>
            <button
              onClick={onQuoteClick}
              className="bulk-quote-btn"
              id="bulk-request-quote-btn"
            >
              <span>Request a Quote</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
