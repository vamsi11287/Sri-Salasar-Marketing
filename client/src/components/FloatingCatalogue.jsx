import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Phone,
  MessageCircle,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { api, getFullFileUrl } from "../services/api";

export default function FloatingCatalogue() {
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogueInfo, setCatalogueInfo] = useState(null);
  const [catalogueError, setCatalogueError] = useState("");
  const [catalogueLoading, setCatalogueLoading] = useState(true);

  useEffect(() => {
    api.getMasterCatalogue().then((data) => {
      setCatalogueInfo(data);
    }).catch((error) => {
      console.error("Could not load the catalogue from the database:", error);
      setCatalogueError("Catalogue could not be loaded.");
    }).finally(() => {
      setCatalogueLoading(false);
    });
  }, []);

  const contactNumbers = [
    {
      label: "Bulk Orders & Executive Line",
      number: "+91 63690 21006",
      rawNumber: "916369021006",
      badge: "Primary"
    },
    {
      label: "Warehouse & Ready Stock Dispatch",
      number: "+91 98400 22482",
      rawNumber: "919840022482",
      badge: "Dispatch"
    },
    {
      label: "Sales & Technical Specifications",
      number: "+91 98402 75139",
      rawNumber: "919840275139",
      badge: "Support"
    }
  ];

  const handleDownload = () => {
    if (!catalogueInfo?.filePath) return;
    const url = getFullFileUrl(catalogueInfo.filePath);
    const link = document.createElement("a");
    link.href = url;
    link.download = catalogueInfo.fileName || catalogueInfo.title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Persistent Floating Catalogue Button */}
      <button
        className="floating-catalogue-btn"
        onClick={() => setModalOpen(true)}
        aria-label="Download Catalogue and Contact Us"
        id="floating-catalogue-trigger"
      >
        <div className="catalogue-btn-icon-wrap">
          <BookOpen size={20} className="catalogue-book-icon" />
        </div>
        <div className="catalogue-btn-label">
          <span className="cat-sub">Quick View</span>
          <strong className="cat-main">Catalogue &amp; Direct Call</strong>
        </div>
      </button>

      {/* Catalogue & Contact Numbers Modal */}
      {modalOpen && (
        <div className="catalogue-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="catalogue-modal-card animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="catalogue-modal-header">
              <div className="cat-header-title">
                <span className="cat-tag">SRI SALASAR MARKETING</span>
                <h3>Corporate Catalogue &amp; Direct Assistance</h3>
              </div>
              <button
                className="cat-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Catalogue Download Card */}
            <div className="catalogue-pdf-box">
              {catalogueInfo ? (
                <>
                  <div className="pdf-icon-badge">
                    <FileText size={32} className="pdf-icon" />
                    <span className="pdf-pill">PDF</span>
                  </div>
                  <div className="pdf-info">
                    <h4>{catalogueInfo.title}</h4>
                    <p>{catalogueInfo.description}</p>
                    <div className="pdf-meta-row">
                      {catalogueInfo.version && <span className="pdf-meta-tag">Version {catalogueInfo.version}</span>}
                      {catalogueInfo.fileSize && <span className="pdf-meta-tag">{catalogueInfo.fileSize}</span>}
                      <span className="pdf-meta-tag cert">
                        <ShieldCheck size={12} /> Verified Specs
                      </span>
                    </div>
                  </div>
                  <button
                    className="pdf-download-action-btn"
                    onClick={handleDownload}
                    disabled={!catalogueInfo.filePath}
                    id="cat-modal-download-btn"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>
                </>
              ) : (
                <p role={catalogueError ? "alert" : "status"}>
                  {catalogueLoading ? "Loading catalogue..." : catalogueError || "No catalogue is currently available."}
                </p>
              )}
            </div>

            {/* Direct Contact Numbers with Call and WhatsApp buttons */}
            <div className="catalogue-contacts-section">
              <h4 className="contacts-section-title">
                Direct Contact Lines (Tap to Call or Chat)
              </h4>
              <p className="contacts-section-subtitle">
                Immediate response from our Chennai corporate desk for bulk pricing &amp; dispatch.
              </p>

              <div className="catalogue-numbers-grid">
                {contactNumbers.map((c, i) => (
                  <div key={i} className="catalogue-number-item">
                    <div className="num-info-col">
                      <div className="num-label-row">
                        <span className="num-label">{c.label}</span>
                        <span className={`num-badge ${c.badge.toLowerCase()}`}>{c.badge}</span>
                      </div>
                      <span className="num-digits">{c.number}</span>
                    </div>

                    <div className="num-actions-col">
                      {/* Call Button */}
                      <a
                        href={`tel:${c.rawNumber}`}
                        className="num-action-btn call-btn"
                        title={`Call ${c.number}`}
                      >
                        <Phone size={15} />
                        <span>Call</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${c.rawNumber}?text=${encodeURIComponent(
                          `Hello Sri Salasar Marketing, I am looking at your product catalogue and would like to enquire about bulk pricing.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="num-action-btn wa-btn"
                        title={`WhatsApp ${c.number}`}
                      >
                        <MessageCircle size={15} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="catalogue-modal-footer">
              <CheckCircle2 size={15} className="green-tick" />
              <span>Pan-India Ready Stock Dispatch &bull; GST Invoicing Provided</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
