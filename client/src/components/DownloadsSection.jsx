import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { api, getFullFileUrl } from "../services/api";

export default function DownloadsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [documentsError, setDocumentsError] = useState("");
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    api.getDocuments().then((data) => {
      setDocuments(Array.isArray(data) ? data : []);
    }).catch((error) => {
      console.error("Could not load documents from the database:", error);
      setDocumentsError("Documents could not be loaded. Please try again later.");
    }).finally(() => {
      setDocumentsLoading(false);
    });
  }, []);

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === "all") return true;
    if (activeTab === "catalogue") return doc.category === "Catalogue";
    if (activeTab === "tds") return doc.category === "TDS";
    if (activeTab === "certificates") return doc.category === "Certificate";
    return true;
  });

  const handleDownload = (doc) => {
    const url = getFullFileUrl(doc.filePath);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.fileName || `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Catalogue":
        return <Layers size={20} className="cat-icon-blue" />;
      case "TDS":
        return <FileText size={20} className="cat-icon-orange" />;
      case "Certificate":
        return <Award size={20} className="cat-icon-green" />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <section className="downloads-section-wrapper" id="downloads">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-heading-center">
          <span className="section-pill-tag">TECHNICAL DOCUMENTATION &amp; COMPLIANCE</span>
          <h2 className="section-main-title">
            Resource Downloads &amp; <span className="title-orange">Certificates</span>
          </h2>
          <p className="section-subtitle">
            Download our official corporate product catalogue, engineering technical data sheets (TDS),
            and certified laboratory compliance reports.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="downloads-tabs-row">
          <button
            className={`download-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Resources ({documents.length})
          </button>
          <button
            className={`download-tab-btn ${activeTab === "catalogue" ? "active" : ""}`}
            onClick={() => setActiveTab("catalogue")}
          >
            Product Catalogues
          </button>
          <button
            className={`download-tab-btn ${activeTab === "tds" ? "active" : ""}`}
            onClick={() => setActiveTab("tds")}
          >
            Technical Data Sheets (TDS)
          </button>
          <button
            className={`download-tab-btn ${activeTab === "certificates" ? "active" : ""}`}
            onClick={() => setActiveTab("certificates")}
          >
            Compliance &amp; Certifications
          </button>
        </div>

        {/* Documents Grid */}
        <div className="documents-cards-grid">
          {filteredDocs.map((doc, idx) => (
            <div key={doc._id || idx} className="doc-resource-card">
              <div className="doc-card-top">
                <div className="doc-icon-box">{getCategoryIcon(doc.category)}</div>
                <span className={`doc-category-badge ${doc.category.toLowerCase()}`}>
                  {doc.category}
                </span>
              </div>

              <div className="doc-card-body">
                <h3 className="doc-card-title">{doc.title}</h3>
                <p className="doc-card-desc">{doc.description}</p>
              </div>

              <div className="doc-card-meta">
                <span className="doc-meta-item">PDF Format</span>
                <span className="doc-meta-bullet">&bull;</span>
                {doc.fileSize && (
                  <>
                    <span className="doc-meta-item">{doc.fileSize}</span>
                    <span className="doc-meta-bullet">&bull;</span>
                  </>
                )}
                {doc.version && <span className="doc-meta-item">Rev. {doc.version}</span>}
              </div>

              <button
                className="doc-download-cta-btn"
                onClick={() => handleDownload(doc)}
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
          {documentsError && <p role="alert">{documentsError}</p>}
          {documentsLoading && <p role="status">Loading documents...</p>}
          {!documentsLoading && !documentsError && filteredDocs.length === 0 && (
            <p>No documents are currently available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
