import React from "react";
import { ShieldCheck, CheckCircle2, Award, Zap, FileText, ArrowRight } from "lucide-react";

export default function QualitySection({ onQuoteClick }) {
  const qualityPillars = [
    {
      title: "Tensile & Load Testing",
      desc: "Cable ties undergo continuous pull-force tensile tests to guarantee zero snap under industrial cable weight and thermal vibration."
    },
    {
      title: "Micron & Thickness Calibration",
      desc: "Our stretch films and BOPP packing tapes maintain consistent micron thickness across the entire roll length, preventing breaks."
    },
    {
      title: "Dielectric & Flame Retardance",
      desc: "PVC insulation tapes are tested up to 5,000V dielectric breakdown with self-extinguishing flame-retardant properties (IS 7809 standards)."
    },
    {
      title: "Pressure & Leakage Sealing",
      desc: "PTFE Teflon thread tapes are verified for 100% airtight seals on high-pressure hydraulic and compressed pneumatic junctions."
    }
  ];

  return (
    <div className="quality-page-wrapper">
      <div className="page-header-strip">
        <div className="section-container">
          <span className="page-category-tag">QUALITY ASSURANCE STANDARDS</span>
          <h1 className="page-title">
            Zero-Defect Commitment in <span className="title-orange">Every Batch</span>
          </h1>
          <p className="page-subtitle">
            Rigorous material selection, strict dimensional tolerances, and multi-stage testing for industrial peace of mind.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="quality-pillars-grid">
          {qualityPillars.map((pillar, i) => (
            <div key={i} className="quality-card">
              <div className="quality-card-header">
                <ShieldCheck size={26} className="quality-icon" />
                <span className="pillar-index">0{i + 1}</span>
              </div>
              <h3 className="quality-card-title">{pillar.title}</h3>
              <p className="quality-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="quality-inspection-banner">
          <div className="inspection-content">
            <h3>Need Batch Test Reports &amp; Specifications?</h3>
            <p>
              We provide formal Technical Data Sheets (TDS) and Certificates of Analysis (COA) for institutional procurement and corporate compliance.
            </p>
          </div>
          <button onClick={onQuoteClick} className="inspection-quote-btn">
            Request Technical Data Sheet <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
