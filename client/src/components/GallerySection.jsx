import React, { useState } from "react";
import {
  Image,
  Layers,
  ZoomIn,
  X,
  PlayCircle,
  Truck,
  Building,
  Box
} from "lucide-react";

export default function GallerySection() {
  const [filter, setFilter] = useState("all");
  const [activeMedia, setActiveMedia] = useState(null);

  const galleryItems = [
    {
      id: 1,
      type: "image",
      category: "warehouse",
      title: "Central Dispatch Warehouse - Chennai",
      caption: "High-density pallet racking with over 25,000 cartons of ready-to-dispatch packaging supplies.",
      src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      type: "image",
      category: "stocks",
      title: "Bulk Master Cartons of Nylon Cable Ties",
      caption: "Organized inventory segregated by length (100mm to 450mm) and natural white/UV black formulations.",
      src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      type: "image",
      category: "factory",
      title: "Automated Precision Injection Moulding",
      caption: "High-tonnage injection machines producing virgin Nylon 66 ties with consistent tensile ratchet teeth.",
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      type: "image",
      category: "stocks",
      title: "BOPP Adhesive Tape Jumbo Slitting & Packaging",
      caption: "48mm and 72mm tape rolls converted and packed 72 rolls per master carton under cleanroom conditions.",
      src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      type: "image",
      category: "warehouse",
      title: "Daily Freight Dispatch Dock",
      caption: "Pan-India logistics partners loading consignments for Bangalore, Hyderabad, Mumbai, and Delhi.",
      src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      type: "image",
      category: "factory",
      title: "Quality Testing & Tensile Calibration Laboratory",
      caption: "Every production batch undergoes destructive tensile pull tests to guarantee rating standards.",
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80"
    }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return (
    <section className="gallery-section-wrapper" id="gallery">
      <div className="section-container">
        {/* Header */}
        <div className="section-heading-center">
          <span className="section-pill-tag">INFRASTRUCTURE &amp; READY INVENTORY</span>
          <h2 className="section-main-title">
            Factory, Warehouse &amp; <span className="title-orange">Stock Gallery</span>
          </h2>
          <p className="section-subtitle">
            A glimpse into our state-of-the-art storage, testing facilities, and ready-to-dispatch inventory.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="gallery-filter-pills">
          <button
            className={`gallery-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Facilities ({galleryItems.length})
          </button>
          <button
            className={`gallery-pill ${filter === "warehouse" ? "active" : ""}`}
            onClick={() => setFilter("warehouse")}
          >
            Warehouse &amp; Dispatch Dock
          </button>
          <button
            className={`gallery-pill ${filter === "stocks" ? "active" : ""}`}
            onClick={() => setFilter("stocks")}
          >
            Ready Stock Cartons
          </button>
          <button
            className={`gallery-pill ${filter === "factory" ? "active" : ""}`}
            onClick={() => setFilter("factory")}
          >
            Factory &amp; Testing Lab
          </button>
        </div>

        {/* Media Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-card"
              onClick={() => setActiveMedia(item)}
            >
              <div className="gallery-img-wrapper">
                <img
                  src={item.src}
                  alt={item.title}
                  className="gallery-img"
                  loading="lazy"
                />
                <div className="gallery-hover-overlay">
                  <span className="zoom-indicator">
                    <ZoomIn size={18} /> View Photo
                  </span>
                </div>
                <span className="gallery-category-tag">{item.category}</span>
              </div>
              <div className="gallery-card-info">
                <h4 className="gallery-item-title">{item.title}</h4>
                <p className="gallery-item-caption">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="lightbox-backdrop" onClick={() => setActiveMedia(null)}>
          <div
            className="lightbox-window animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setActiveMedia(null)}
              aria-label="Close photo"
            >
              <X size={22} />
            </button>
            <img
              src={activeMedia.src}
              alt={activeMedia.title}
              className="lightbox-full-img"
            />
            <div className="lightbox-caption-bar">
              <h3>{activeMedia.title}</h3>
              <p>{activeMedia.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
