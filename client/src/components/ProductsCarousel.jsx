import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { getFullFileUrl } from "../services/api";

export default function ProductsCarousel({
  products,
  onSelectProduct,
  onViewAllProducts
}) {
  // Showcase the first 5 core products on homepage as in the mockup
  const featured = products.slice(0, 5);

  return (
    <section className="featured-products-section" id="our-products">
      <div className="section-container">
        {/* Section Heading matching mockup */}
        <div className="section-header-row">
          <div className="section-titles">
            <h2 className="section-main-title">
              Our <span className="title-orange">Products</span>
            </h2>
            <p className="section-subtitle">
              Wide range of packaging and electrical fixing products to meet your business needs.
            </p>
          </div>

          <button
            onClick={onViewAllProducts}
            className="view-all-products-link-btn"
            id="view-all-products-btn"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 5 Product Cards Horizontal Row matching the mockup */}
        <div className="products-showcase-grid">
          {featured.map((product) => (
            <article key={product._id || product.id} className="home-product-card group">
              <div
                className="card-image-box"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={getFullFileUrl(product.image || (Array.isArray(product.images) && product.images[0]) || "")}
                  alt={product.name}
                  className="product-card-img"
                  loading="lazy"
                />

                <div className="card-hover-overlay">
                  <span className="quick-view-badge">
                    <Eye size={14} /> Quick View
                  </span>
                </div>
              </div>

              <div className="card-info-box">
                <h3
                  className="product-card-title"
                  onClick={() => onSelectProduct(product)}
                >
                  {product.name}
                </h3>
                <p className="product-card-detail">{product.detail}</p>

                <div className="card-action-row">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="card-view-details-btn"
                    aria-label={`View details for ${product.name}`}
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} className="arrow-icon" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
