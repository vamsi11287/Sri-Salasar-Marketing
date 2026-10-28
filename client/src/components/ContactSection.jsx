import React from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { getWhatsAppUrl } from "./QuoteSection";

export default function ContactSection({ onQuoteClick }) {
  return (
    <div className="contact-page-wrapper">
      <div className="page-header-strip">
        <div className="section-container">
          <span className="page-category-tag">GET IN TOUCH</span>
          <h1 className="page-title">
            Contact <span className="title-orange">Sri Salasar Marketing</span>
          </h1>
          <p className="page-subtitle">
            Speak directly with our packaging and electrical sales specialists for instant inquiries and order support.
          </p>
        </div>
      </div>

      <div className="section-container contact-grid-layout">
        <div className="contact-info-cards-col">
          <div className="contact-block">
            <div className="contact-icon-wrapper"><Phone size={22} /></div>
            <div>
              <h3>Call &amp; Direct Sales Desk</h3>
              <p>Speak to our dispatch and wholesale team:</p>
              <div className="phone-numbers-list">
                <a href="tel:+916369021006">+91 63690 21006 (Primary &amp; WhatsApp)</a>
                <a href="tel:+919840022482">+91 98400 22482</a>
                <a href="tel:+919840275139">+91 98402 75139</a>
              </div>
            </div>
          </div>

          <div className="contact-block">
            <div className="contact-icon-wrapper"><Mail size={22} /></div>
            <div>
              <h3>Email Inquiries</h3>
              <p>For RFQs, tender tenders, and commercial purchase orders:</p>
              <a href="mailto:info@srisalasarmarketing.in" className="email-link">
                info@srisalasarmarketing.in
              </a>
            </div>
          </div>

          <div className="contact-block">
            <div className="contact-icon-wrapper"><Clock size={22} /></div>
            <div>
              <h3>Working Hours</h3>
              <p>Monday – Saturday: 9:30 AM – 7:30 PM</p>
              <small>Sunday: Emergency warehouse dispatch upon prior booking</small>
            </div>
          </div>

          <div className="contact-block">
            <div className="contact-icon-wrapper"><MapPin size={22} /></div>
            <div>
              <h3>Distribution &amp; Logistics Coverage</h3>
              <p>Central Warehouse: Chennai, Tamil Nadu, India</p>
              <p className="coverage-sub">Daily transport dispatches across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala &amp; Pan-India.</p>
            </div>
          </div>
        </div>

        <div className="contact-whatsapp-card">
          <div className="whatsapp-box-inner">
            <MessageCircle size={44} className="whatsapp-card-icon" />
            <h2>Instant WhatsApp Support</h2>
            <p>
              Skip the email delay. Chat directly with our product specialist on WhatsApp for instant proforma quotes, product photos, and transport booking.
            </p>
            <a
              href={getWhatsAppUrl("Hello Sri Salasar Marketing, I would like to get a quote for packaging and electrical supplies.")}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-launch-btn"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp (+91 63690 21006)</span>
            </a>

            <div className="whatsapp-guarantees">
              <span><CheckCircle2 size={15} /> Instant Response</span>
              <span><CheckCircle2 size={15} /> Sample Pack Coordination</span>
              <span><CheckCircle2 size={15} /> Live Stock Availability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
