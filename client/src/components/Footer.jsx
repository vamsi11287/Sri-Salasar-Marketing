import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building,
  FileCheck2,
  ExternalLink
} from "lucide-react";
import logo from "../assets/sri-salasar-logo.png";
import { getWhatsAppUrl } from "./QuoteSection";

export default function Footer({ onNavigate }) {
  const googleMapsUrl =
    "https://maps.google.com/?q=Chennai,+Tamil+Nadu,+India+Sri+Salasar+Marketing";

  return (
    <footer className="site-corporate-footer" id="footer">
      <div className="section-container">
        {/* Top Trust & Legal Strip (GST & Business Hours) */}
        <div className="footer-compliance-strip">
          <div className="compliance-item">
            <FileCheck2 size={18} className="compliance-icon-orange" />
            <div className="compliance-text">
              <span className="comp-label">Registered GST Identification:</span>
              <strong className="comp-value">GSTIN: 33AAAFS1234F1Z5 (Tamil Nadu)</strong>
            </div>
          </div>

          <div className="compliance-divider" />

          <div className="compliance-item">
            <Clock size={18} className="compliance-icon-orange" />
            <div className="compliance-text">
              <span className="comp-label">Business Working Hours:</span>
              <strong className="comp-value">Mon – Sat: 9:30 AM – 7:30 PM (Sunday: Closed)</strong>
            </div>
          </div>

          <div className="compliance-divider" />

          <div className="compliance-item">
            <ShieldCheck size={18} className="compliance-icon-green" />
            <div className="compliance-text">
              <span className="comp-label">Quality Assurance:</span>
              <strong className="comp-value">100% Virgin Grade Guaranteed</strong>
            </div>
          </div>
        </div>

        {/* 4-Column Main Grid */}
        <div className="footer-columns-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo-wrapper">
              <img
                src={logo}
                alt="Sri Salasar Marketing Logo"
                className="footer-brand-logo"
              />
            </div>
            <p className="footer-about-text">
              Sri Salasar Marketing is your trusted industrial supplier for virgin Nylon 66 cable ties,
              PVC wire clamps with hardened steel nails, BOPP packaging tapes, and pallet stretch film.
              Immediate dispatch from Chennai across India.
            </p>

            <a
              href="https://www.google.com/business/"
              target="_blank"
              rel="noreferrer"
              className="footer-google-business-link"
            >
              <span>⭐ Verified on Google Business Profile</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-nav-list">
              <li>
                <button onClick={() => onNavigate("home")}>Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate("products")}>Product Catalogue</button>
              </li>
              <li>
                <button onClick={() => onNavigate("downloads")}>Downloads &amp; TDS</button>
              </li>
              <li>
                <button onClick={() => onNavigate("gallery")}>Factory &amp; Stocks Gallery</button>
              </li>
              <li>
                <button onClick={() => onNavigate("quality")}>Quality &amp; Testing</button>
              </li>
              <li>
                <button onClick={() => onNavigate("quote")}>Request Bulk Quote</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contact */}
          <div className="footer-col contact-col">
            <h4 className="footer-col-title">Direct Sales &amp; Dispatch</h4>
            <div className="footer-contact-items">
              <a href="tel:+916369021006" className="footer-contact-item">
                <Phone size={15} /> <span>+91 63690 21006 (Bulk Quotes)</span>
              </a>
              <a href="tel:+919840022482" className="footer-contact-item">
                <Phone size={15} /> <span>+91 98400 22482 (Warehouse)</span>
              </a>
              <a href="tel:+919840275139" className="footer-contact-item">
                <Phone size={15} /> <span>+91 98402 75139 (Desk)</span>
              </a>
              <a href="mailto:info@srisalasarmarketing.in" className="footer-contact-item">
                <Mail size={15} /> <span>info@srisalasarmarketing.in</span>
              </a>
            </div>
          </div>

          {/* Column 4: Location & Google Maps */}
          <div className="footer-col map-col">
            <h4 className="footer-col-title">Warehouse &amp; Dispatch Hub</h4>
            <div className="footer-map-card">
              <div className="map-address-block">
                <MapPin size={16} className="pin-icon" />
                <address className="not-italic">
                  <strong>Sri Salasar Marketing</strong>
                  <br />
                  Commercial Hub, Chennai,
                  <br />
                  Tamil Nadu - 600001, India
                </address>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="view-maps-btn"
                id="footer-google-maps-btn"
              >
                <MapPin size={14} />
                <span>Open in Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Sri Salasar Marketing. All rights reserved. GST
            Registered Industrial Supplier.
          </p>
          <div className="footer-bottom-links">
            <span>SSL Encrypted &bull; 100% Secure Ordering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
