import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  Layers,
  CircleDollarSign,
  Truck,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import heroImg from "../assets/images/hero_packaging_montage.jpg";

export default function Hero({ onExploreProducts, onGetQuote }) {
  const highlights = [
    {
      icon: BadgeCheck,
      title: "Best Quality",
      desc: "Virgin grade materials"
    },
    {
      icon: Layers,
      title: "Wide Range",
      desc: "All sizes & specs"
    },
    {
      icon: CircleDollarSign,
      title: "Competitive Price",
      desc: "Direct bulk rates"
    },
    {
      icon: Truck,
      title: "Fast & Reliable Supply",
      desc: "Pan-India dispatch"
    }
  ];

  return (
    <section className="hero-section" id="hero">
      <div className="hero-overlay-glow" />
      <div className="hero-container">
        {/* Left Hero Content */}
        <div className="hero-content-col">
          <div className="hero-badge-pill">
            <Sparkles size={13} className="hero-sparkle-icon" />
            <span>YOUR TRUSTED PACKAGING PARTNER</span>
          </div>

          <h1 className="hero-headline">
            COMPLETE <br />
            <span className="hero-headline-highlight">PACKAGING &amp;</span> <br />
            ELECTRICAL FIXING <br />
            SOLUTIONS
          </h1>

          <p className="hero-subheadline">
            High quality products for industries, businesses &amp; everyday needs.
          </p>

          <p className="hero-description">
            From heavy-duty Nylon cable ties and PVC wire clamps to industrial carton
            sealing tapes, shrink films, and strapping rolls — precision supplies for seamless
            operations.
          </p>

          {/* 4 Feature Icons Row */}
          <div className="hero-features-row">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="hero-feature-item">
                  <div className="hero-feature-icon-bubble">
                    <Icon size={20} />
                  </div>
                  <div className="hero-feature-texts">
                    <span className="hero-feature-title">{item.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dual Action Buttons */}
          <div className="hero-cta-buttons">
            <button
              onClick={onExploreProducts}
              className="hero-btn-primary"
              id="hero-view-products-btn"
            >
              <span>View Products</span>
              <ArrowRight size={17} className="btn-arrow" />
            </button>

            <button
              onClick={onGetQuote}
              className="hero-btn-secondary"
              id="hero-get-quote-btn"
            >
              <span>Get a Quote</span>
            </button>
          </div>

          {/* Bottom Trust Line */}
          <div className="hero-trust-bar">
            <span className="trust-item">
              <CheckCircle2 size={15} className="trust-check" /> 100% Genuine Materials
            </span>
            <span className="trust-divider">•</span>
            <span className="trust-item">
              <CheckCircle2 size={15} className="trust-check" /> Ready Stock &amp; Same-Day Dispatch
            </span>
            <span className="trust-divider">•</span>
            <span className="trust-item">
              <CheckCircle2 size={15} className="trust-check" /> GST Invoicing &amp; B2B Support
            </span>
          </div>
        </div>

        {/* Right Hero Product Stage */}
        <div className="hero-stage-col">
          <div className="hero-stage-frame">
            <div className="stage-glow-ambient" />
            <img
              src={heroImg}
              alt="Sri Salasar Marketing Packaging and Electrical Supplies Montage"
              className="hero-stage-img"
            />

            {/* Blue Product Badge from Mockup */}
            <div className="hero-floating-badge badge-top-right">
              <span className="badge-title">CABLE TIES</span>
              <span className="badge-subtitle">MULTIPLE SIZES</span>
              <span className="badge-tag">WHITE &amp; BLACK</span>
            </div>

            {/* Bottom floating trust card */}
            <div className="hero-floating-badge badge-bottom-left">
              <ShieldCheck size={22} className="shield-icon" />
              <div>
                <strong>Assured Industrial Grade</strong>
                <small>Packaging &amp; Electrical Fixing</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
