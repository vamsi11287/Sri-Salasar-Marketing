import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Scale,
  Sparkles,
  Palette
} from "lucide-react";
import { getWhatsAppUrl } from "./QuoteSection";
import { getFullFileUrl } from "../services/api";

export default function ProductDetailModal({ product, onClose, onQuoteRequest }) {
  if (!product) return null;

  const allImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

  const [activeImage, setActiveImage] = useState(allImages[0] || product.image || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : ""
  );

  const handleWhatsAppEnquiry = () => {
    let msg = `Hello Sri Salasar Marketing, I am interested in *${product.name}*`;
    if (selectedSize) msg += ` (Size: ${selectedSize})`;
    if (selectedColor) msg += ` (Color: ${selectedColor})`;
    msg += `.\nPlease share technical data sheet, bulk quantity pricing, and dispatch schedule.`;
    window.open(getWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
  };

  const handleQuoteClick = () => {
    onClose();
    if (onQuoteRequest) {
      onQuoteRequest({
        ...product,
        preferredSize: selectedSize,
        preferredColor: selectedColor
      });
    }
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal-window animate-scaleUp modal-wide-specs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="product-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="product-modal-layout">
          {/* Left Column: Image Stage & Trust Pills */}
          <div className="product-modal-img-col">
            <div className="modal-img-box">
              <img
                src={getFullFileUrl(activeImage || product.image)}
                alt={product.name}
                className="modal-main-img"
              />
              <span className="modal-category-badge">{product.category}</span>
            </div>

            {/* Multi-image thumbnail gallery */}
            {allImages.length > 1 && (
              <div style={{
                display: "flex",
                gap: "8px",
                marginTop: "10px",
                overflowX: "auto",
                paddingBottom: "4px"
              }}>
                {allImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: (activeImage === imgUrl) ? "2px solid #f45b16" : "1.5px solid #cbd5e1",
                      background: "#fff",
                      cursor: "pointer",
                      padding: "2px",
                      flexShrink: 0,
                      opacity: (activeImage === imgUrl) ? 1 : 0.65,
                      transition: "all 0.2s ease"
                    }}
                    title={`View photo ${i + 1}`}
                  >
                    <img
                      src={getFullFileUrl(imgUrl)}
                      alt={`Photo ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}


            <div className="modal-trust-tags">
              <div className="trust-pill">
                <ShieldCheck size={14} /> Virgin Grade Guaranteed
              </div>
              <div className="trust-pill">
                <Truck size={14} /> Ready Stock Chennai Dispatch
              </div>
            </div>

            {/* Color Swatches if available */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="modal-color-picker-box">
                <span className="picker-title">
                  <Palette size={14} /> Available Colours:
                </span>
                <div className="modal-color-pills">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`color-pill-tag ${selectedColor === c ? "active" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Technical Specs & Chart */}
          <div className="product-modal-info-col">
            <div className="modal-heading-area">
              <span className="modal-eyebrow">SRI SALASAR INDUSTRIAL CATALOGUE</span>
              <h2 className="modal-product-title">{product.name}</h2>
              <p className="modal-product-detail">{product.detail}</p>
            </div>

            {/* Price & MOQ Strip */}
            <div className="modal-price-strip">
              <div className="price-item">
                <span className="label">Indicative Price</span>
                <strong className="value">{product.price || "-"}</strong>
              </div>
              <div className="price-divider" />
              <div className="price-item">
                <span className="label">Min. Order Qty (MOQ)</span>
                <strong className="value">{product.moq || "-"}</strong>
              </div>
              {product.loadRating && (
                <>
                  <div className="price-divider" />
                  <div className="price-item">
                    <span className="label">Tensile Load Rating</span>
                    <strong className="value orange-val">{product.loadRating}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <p className="modal-description">{product.description}</p>

            {/* Key Technical Properties */}
            <div className="modal-specs-table">
              {product.material && (
                <div className="spec-row">
                  <span className="spec-name">Raw Material:</span>
                  <span className="spec-val highlight-bold">{product.material}</span>
                </div>
              )}
              {product.packSize && (
                <div className="spec-row">
                  <span className="spec-name">Packaging Unit:</span>
                  <span className="spec-val">{product.packSize}</span>
                </div>
              )}
              {product.sizes && (
                <div className="spec-row">
                  <span className="spec-name">Available Sizes:</span>
                  <span className="spec-val">{product.sizes}</span>
                </div>
              )}
              {product.applications && (
                <div className="spec-row">
                  <span className="spec-name">Best Applications:</span>
                  <span className="spec-val">{product.applications}</span>
                </div>
              )}
            </div>

            {/* Cable Ties & Technical Size Chart Table (Requirement #2) */}
            {product.sizeChart && product.sizeChart.length > 0 && (
              <div className="size-chart-container">
                <div className="size-chart-header">
                  <h4>
                    <Scale size={16} /> Size &amp; Tensile Strength Chart (Length × Width)
                  </h4>
                  <span className="chart-note">Select a row to specify in enquiry</span>
                </div>
                <div className="size-chart-table-wrap">
                  <table className="size-chart-table">
                    <thead>
                      <tr>
                        <th>Length × Width</th>
                        <th>Max Bundle Ø</th>
                        <th>Tensile Strength (Kg)</th>
                        <th>Tensile Strength (Lbs)</th>
                        <th>Pack Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizeChart.map((row, idx) => {
                        const rowSizeLabel = `${row.length} × ${row.width}`;
                        const isSelected = selectedSize === rowSizeLabel;
                        return (
                          <tr
                            key={idx}
                            className={isSelected ? "selected-row" : ""}
                            onClick={() => setSelectedSize(rowSizeLabel)}
                            title="Click to select this size for enquiry"
                          >
                            <td className="size-cell">
                              <strong>{row.length}</strong> × {row.width}
                            </td>
                            <td>{row.maxBundleDia || "-"}</td>
                            <td className="metric-cell">{row.tensileStrengthKg || "-"}</td>
                            <td className="metric-cell">{row.tensileStrengthLbs || "-"}</td>
                            <td>{row.packSize || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {selectedSize && (
                  <div className="selected-size-chip">
                    Selected for Enquiry: <strong>{selectedSize}</strong>
                    <button onClick={() => setSelectedSize("")}>Clear</button>
                  </div>
                )}
              </div>
            )}

            {/* Key Bullet Features */}
            {product.features && (Array.isArray(product.features) ? product.features.length > 0 : Boolean(product.features)) && (
              <div className="modal-features-list">
                <h4>Key Specifications &amp; Quality Assurances:</h4>
                <ul>
                  {(Array.isArray(product.features) ? product.features : [product.features]).map((feat, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} className="feat-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-action-row">
              <button
                className="modal-whatsapp-btn"
                onClick={handleWhatsAppEnquiry}
                id="modal-whatsapp-enquire-btn"
              >
                <MessageCircle size={18} />
                <span>Enquire Now on WhatsApp</span>
              </button>

              <button
                className="modal-quote-btn"
                onClick={handleQuoteClick}
                id="modal-request-quote-btn"
              >
                <span>Request Custom Bulk Quote</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
