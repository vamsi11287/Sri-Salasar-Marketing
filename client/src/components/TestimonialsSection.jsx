import React from "react";
import { Star, ShieldCheck, Quote, Building2, CheckCircle2 } from "lucide-react";

export default function TestimonialsSection() {
  const clientLogos = [
    { name: "Apex Electricals & Switchgears", sector: "Control Panels" },
    { name: "TransLogistics 3PL Hub", sector: "Warehousing" },
    { name: "SunVolt Solar EPC Solutions", sector: "Renewable Energy" },
    { name: "Bharat Auto Components", sector: "Automotive OEM" },
    { name: "Kaveri Packaging Industries", sector: "Corrugated Boxes" },
    { name: "Metro Infra Cables & Conduits", sector: "Construction" }
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "Sri Salasar's 200mm and 300mm Nylon cable ties have zero breakage during high-speed panel assembly. The tensile strength and flame resistance consistently pass our client inspection tests.",
      name: "S. K. Venkatesh",
      role: "Procurement Head",
      company: "Apex Switchgears Pvt Ltd",
      city: "Chennai (Ambattur Industrial Estate)",
      rating: 5,
      product: "Nylon 66 Cable Ties (UL 94V-2)"
    },
    {
      id: 2,
      quote:
        "We consume over 300 cartons of 48mm BOPP tape and virgin carton patti roll every month. Their tapes have high tack, zero carton popping during interstate freight, and dependable ready stock delivery.",
      name: "Rameshwar Patel",
      role: "Operations Manager",
      company: "TransLogistics 3PL Hub",
      city: "Bangalore & Sriperumbudur Hub",
      rating: 5,
      product: "Industrial BOPP Adhesive Tapes & Patti Rolls"
    },
    {
      id: 3,
      quote:
        "Their PVC wire clamps with hardened steel nails are unbeatable for surface conduit wiring on concrete walls. The nail doesn't bend even on high-strength cured masonry.",
      name: "K. Muralidharan",
      role: "Chief Electrical Contractor",
      company: "Metro Infra Buildcon",
      city: "Coimbatore & Madurai",
      rating: 5,
      product: "PVC Wire Clamps with Hardened Nails"
    }
  ];

  return (
    <section className="testimonials-section-wrapper" id="testimonials">
      <div className="section-container">
        {/* Client Logos Header & Grid */}
        <div className="client-logos-area">
          <span className="client-logos-eyebrow">
            TRUSTED BY OVER 500+ INDUSTRIAL CONTRACTORS, WAREHOUSES &amp; OEMS
          </span>

          <div className="client-logos-grid">
            {clientLogos.map((client, idx) => (
              <div key={idx} className="client-logo-card">
                <Building2 size={24} className="client-logo-icon" />
                <span className="client-brand-name">{client.name}</span>
                <span className="client-sector-tag">{client.sector}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="section-heading-center">
          <span className="section-pill-tag">VERIFIED B2B FEEDBACK</span>
          <h2 className="section-main-title">
            What Our <span className="title-orange">Clients Say</span>
          </h2>
          <p className="section-subtitle">
            Consistent quality, accurate count guarantees, and immediate Chennai dispatch trusted across industries.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-card-top">
                <Quote size={28} className="quote-icon" />
                <div className="stars-row">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="star-filled" fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>

              <p className="testimonial-quote-text">"{t.quote}"</p>

              <div className="testimonial-product-tag">
                <CheckCircle2 size={13} />
                <span>Verified order: {t.product}</span>
              </div>

              <div className="testimonial-author-row">
                <div className="author-avatar-badge">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="author-info">
                  <strong className="author-name">{t.name}</strong>
                  <span className="author-role">{t.role}</span>
                  <span className="author-company">
                    {t.company} &bull; {t.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
