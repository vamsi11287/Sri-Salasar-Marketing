import React from "react";
import { ArrowRight, Check } from "lucide-react";

const industriesData = [];

export default function IndustriesSection({ onExploreSupplies }) {
  return (
    <section className="industries-section" id="industries">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">SECTORS &amp; APPLICATIONS</span>
          <h2 className="section-main-title">
            Industries <span className="title-orange">We Serve</span>
          </h2>
          <p className="section-subtitle-centered">
            Powering packaging, securing logistics, and organizing electrical wiring across diverse Indian commercial sectors.
          </p>
        </div>

        <div className="industries-grid">
          {industriesData.map((ind) => (
            <div key={ind.id} className="industry-card-item">
              <div className="industry-card-img-wrapper">
                <img
                  src={ind.image}
                  alt={ind.title}
                  className="industry-card-img"
                  loading="lazy"
                />
                <div className="industry-img-overlay" />
                <div className="industry-floating-title">
                  <h3>{ind.title}</h3>
                  <span>{ind.subtitle}</span>
                </div>
              </div>

              <div className="industry-card-body">
                <p className="industry-desc">{ind.description}</p>
                <div className="industry-supplies-tags">
                  {ind.supplies.map((sup, idx) => (
                    <span key={idx} className="supply-pill">
                      <Check size={11} className="pill-check" /> {sup}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
