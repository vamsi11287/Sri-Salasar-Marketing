import React from "react";
import { CheckCircle2, Award, Clock, Users, Building, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutSection({ onQuoteClick }) {
  return (
    <div className="about-page-wrapper">
      <div className="page-header-strip">
        <div className="section-container">
          <span className="page-category-tag">ABOUT SRI SALASAR MARKETING</span>
          <h1 className="page-title">
            Your Trusted Partner in <span className="title-orange">Packaging &amp; Electrical Fixing</span>
          </h1>
          <p className="page-subtitle">
            Providing high-tensile, industrial-grade supplies to manufacturers, logistics providers, and traders nationwide.
          </p>
        </div>
      </div>

      <div className="section-container about-content-grid">
        <div className="about-text-col">
          <span className="section-eyebrow">OUR STORY &amp; COMMITMENT</span>
          <h2 className="section-main-title">
            Built on Reliability, <span className="title-orange">Integrity &amp; Speed</span>
          </h2>
          <p className="about-paragraph">
            <strong>Sri Salasar Marketing</strong> was established with a clear mission: to provide Indian industries with uncompromising quality in everyday packaging and electrical fixing essentials. Whether you require 10,000 meters of virgin BOPP packing tape for an automated packaging line or 50,000 Nylon 66 cable ties for heavy electrical panel boards, we ensure prompt supply without quality deviations.
          </p>
          <p className="about-paragraph">
            We work directly with certified manufacturers and state-of-the-art extrusion facilities, maintaining large buffer stocks in Chennai and partner distribution hubs to guarantee same-day and next-day dispatches.
          </p>

          <div className="about-stats-grid">
            <div className="about-stat-card">
              <strong>15+</strong>
              <span>Years Industry Expertise</span>
            </div>
            <div className="about-stat-card">
              <strong>500+</strong>
              <span>Active B2B Clients</span>
            </div>
            <div className="about-stat-card">
              <strong>28+</strong>
              <span>States Covered</span>
            </div>
            <div className="about-stat-card">
              <strong>99.4%</strong>
              <span>On-Time Dispatch Rate</span>
            </div>
          </div>
        </div>

        <div className="about-values-col">
          <div className="value-card">
            <div className="value-icon"><Award size={24} /></div>
            <div>
              <h3>Virgin Grade Materials</h3>
              <p>We strictly reject reprocessed, brittle scrap plastics. All our cable ties and strapping rolls are manufactured from certified virgin polymers.</p>
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon"><ShieldCheck size={24} /></div>
            <div>
              <h3>Direct Factory Wholesale Rates</h3>
              <p>Transparent tiered pricing for bulk buyers, distributors, and OEMs with GST-compliant invoicing and proforma transparency.</p>
            </div>
          </div>

          <div className="value-card">
            <div className="value-icon"><Clock size={24} /></div>
            <div>
              <h3>Ready Buffer Stocks</h3>
              <p>Eliminate project delays. Our warehouses stock millions of units ready for immediate express logistics pickup.</p>
            </div>
          </div>

          <button onClick={onQuoteClick} className="about-cta-btn">
            Connect With Our Sales Desk <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
