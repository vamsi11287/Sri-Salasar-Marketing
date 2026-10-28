import React from "react";
import { X, Smartphone, ArrowRight, MessageCircle } from "lucide-react";
import logo from "../assets/sri-salasar-logo.png";
import heroImg from "../assets/images/hero_packaging_montage.jpg";
import { getWhatsAppUrl } from "./QuoteSection";

export default function MobileFrameModal({
  products,
  onClose,
  onSelectProduct,
  onGetQuote
}) {
  return (
    <div className="mobile-preview-overlay" onClick={onClose}>
      <div
        className="mobile-preview-container animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-preview-topbar">
          <div className="mobile-preview-title">
            <Smartphone size={18} />
            <span>Interactive Mobile View Preview</span>
          </div>
          <button className="mobile-preview-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Realistic Smartphone Shell */}
        <div className="smartphone-device">
          <div className="smartphone-notch">
            <div className="notch-camera" />
            <div className="notch-speaker" />
          </div>

          <div className="smartphone-screen-scroll">
            {/* Mobile Header */}
            <div className="mobile-mock-header">
              <img src={logo} alt="Sri Salasar" className="mobile-mock-logo" />
              <button
                className="mobile-mock-quote-btn"
                onClick={() => {
                  onClose();
                  onGetQuote();
                }}
              >
                Quote
              </button>
            </div>

            {/* Mobile Hero */}
            <div className="mobile-mock-hero">
              <span className="mobile-hero-tag">PACKAGING SOLUTIONS</span>
              <h2 className="mobile-hero-title">
                COMPLETE <br />
                <span className="highlight">PACKAGING &amp;</span> <br />
                ELECTRICAL FIXING SOLUTIONS
              </h2>
              <p className="mobile-hero-desc">
                High quality products for industries, businesses &amp; everyday needs.
              </p>

              <div className="mobile-mock-badges">
                <span>Best Quality</span>
                <span>Wide Range</span>
                <span>Competitive Price</span>
                <span>Fast Supply</span>
              </div>

              <div className="mobile-mock-hero-actions">
                <button
                  className="mobile-btn-orange"
                  onClick={() => {
                    onClose();
                    onGetQuote();
                  }}
                >
                  View Products &rarr;
                </button>
              </div>

              <div className="mobile-mock-hero-img-box">
                <img src={heroImg} alt="Hero Products" />
              </div>
            </div>

            {/* Mobile Products Row */}
            <div className="mobile-mock-products-strip">
              <div className="mobile-strip-header">
                <strong>Our Products</strong>
                <button
                  onClick={() => {
                    onClose();
                    onGetQuote();
                  }}
                >
                  View All &rarr;
                </button>
              </div>
              <div className="mobile-products-grid">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="mobile-prod-mini-card"
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                  >
                    <img src={p.image} alt={p.name} />
                    <h5>{p.name}</h5>
                    <small>{p.detail}</small>
                    <span className="mini-link">View Details &rarr;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Floating WhatsApp inside frame */}
            <a
              href={getWhatsAppUrl("Hello Sri Salasar Marketing, enquiry from mobile site.")}
              target="_blank"
              rel="noreferrer"
              className="mobile-in-frame-whatsapp"
            >
              <MessageCircle size={22} />
            </a>
          </div>

          <div className="smartphone-home-bar" />
        </div>
      </div>
    </div>
  );
}
