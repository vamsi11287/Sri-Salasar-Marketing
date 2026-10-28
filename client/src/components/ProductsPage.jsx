import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Scale
} from "lucide-react";
import { getFullFileUrl } from "../services/api";


export default function ProductsPage({
  products = [],
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuoteClick
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("All Sizes");
  const [selectedColor, setSelectedColor] = useState("All Colours");
  const productCategories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))),
    [products]
  );

  // Dynamic Size and Color extraction from product list
  const availableSizes = useMemo(() => {
    const set = new Set(["All Sizes"]);
    products.forEach((p) => {
      if (p.sizes) {
        p.sizes.split(",").forEach((s) => set.add(s.trim()));
      }
      if (p.sizeChart) {
        p.sizeChart.forEach((row) => {
          if (row.length) set.add(row.length.trim());
        });
      }
    });
    return Array.from(set);
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set(["All Colours"]);
    products.forEach((p) => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => set.add(c.trim()));
      }
    });
    return Array.from(set);
  }, [products]);

  // Combined Filtering: Type + Size + Colour + Search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Type / Category Filter
      const matchCat =
        selectedCategory === "All Products" || p.category === selectedCategory;

      // 2. Size Filter
      let matchSize = selectedSize === "All Sizes";
      if (!matchSize) {
        const sizeStr = (p.sizes || "").toLowerCase();
        const inChart = p.sizeChart?.some(
          (r) =>
            r.length?.toLowerCase().includes(selectedSize.toLowerCase()) ||
            `${r.length}x${r.width}`.toLowerCase().includes(selectedSize.toLowerCase())
        );
        matchSize = sizeStr.includes(selectedSize.toLowerCase()) || Boolean(inChart);
      }

      // 3. Colour Filter
      let matchColor = selectedColor === "All Colours";
      if (!matchColor && Array.isArray(p.colors)) {
        matchColor = p.colors.some((c) =>
          c.toLowerCase().includes(selectedColor.toLowerCase())
        );
      }

      // 4. Keyword Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.detail?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      return matchCat && matchSize && matchColor && matchSearch;
    });
  }, [products, selectedCategory, selectedSize, selectedColor, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== "All Products" ||
    selectedSize !== "All Sizes" ||
    selectedColor !== "All Colours" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedCategory("All Products");
    setSelectedSize("All Sizes");
    setSelectedColor("All Colours");
    setSearchQuery("");
  };

  return (
    <div className="products-page-container">
      {/* Page Header */}
      <div className="page-header-strip">
        <div className="section-container">
          <div className="page-title-row">
            <div>
              <span className="page-category-tag">PAN-INDIA CATALOGUE</span>
              <h1 className="page-title">
                Explore All <span className="title-orange">Products</span>
              </h1>
              <p className="page-subtitle">
                Virgin grade industrial cable ties, PVC wire clamps, BOPP packing tapes, and strapping rolls.
              </p>
            </div>

            <button
              onClick={onQuoteClick}
              className="page-quote-direct-btn"
              id="page-header-quote-btn"
            >
              Get Bulk Pricing <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="section-container">
        {/* Multi-Facet Filter Bar (Requirement #3) */}
        <div className="catalogue-filters-bar">
          {/* 1. Search Bar */}
          <div className="search-input-box">
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, size (e.g. 200mm), materials..."
              className="search-input-field"
              id="catalogue-search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </button>
            )}
          </div>

          {/* 2. Facet Dropdowns */}
          <div className="facet-selectors-group">
            {/* Filter by Size */}
            <div className="facet-select-wrap">
              <label htmlFor="filter-size-select">Size:</label>
              <select
                id="filter-size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="facet-select-dropdown"
              >
                {availableSizes.slice(0, 15).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Colour */}
            <div className="facet-select-wrap">
              <label htmlFor="filter-color-select">Colour:</label>
              <select
                id="filter-color-select"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="facet-select-dropdown"
              >
                {availableColors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                className="facet-reset-all-btn"
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RefreshCw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills (Type Filter) */}
        <div className="category-filter-pills-row">
          {["All Products", ...productCategories].map((cat) => (
            <button
              key={cat}
              className={`category-pill-btn ${
                selectedCategory === cat ? "active-pill" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filters Summary Chips */}
        <div className="results-counter-row">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </span>

          <div className="active-filter-chips">
            {selectedCategory !== "All Products" && (
              <span className="filter-chip">
                Type: {selectedCategory}
                <X size={12} onClick={() => setSelectedCategory("All Products")} />
              </span>
            )}
            {selectedSize !== "All Sizes" && (
              <span className="filter-chip">
                Size: {selectedSize}
                <X size={12} onClick={() => setSelectedSize("All Sizes")} />
              </span>
            )}
            {selectedColor !== "All Colours" && (
              <span className="filter-chip">
                Colour: {selectedColor}
                <X size={12} onClick={() => setSelectedColor("All Colours")} />
              </span>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="catalogue-products-grid">
          {filteredProducts.map((product) => (
            <article key={product._id || product.id} className="catalogue-product-card">
              <div
                className="card-media-stage"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={getFullFileUrl(product.image || (Array.isArray(product.images) && product.images[0]) || "")}
                  alt={product.name}
                  className="product-grid-img"
                  loading="lazy"
                />

                <span className="product-category-pill">{product.category}</span>
                {product.loadRating && (
                  <span className="product-tensile-tag" title="Tensile Load Rating">
                    <Scale size={11} /> {product.loadRating.split("(")[0]}
                  </span>
                )}
                <div className="card-hover-overlay">
                  <span className="quick-view-badge">
                    <Eye size={14} /> View Specs &amp; Size Chart
                  </span>
                </div>
              </div>

              <div className="card-details-stage">
                <h3
                  className="catalogue-item-title"
                  onClick={() => onSelectProduct(product)}
                >
                  {product.name}
                </h3>
                <p className="catalogue-item-subtitle">{product.detail}</p>

                {product.material && (
                  <span className="card-material-badge">{product.material}</span>
                )}

                {Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="card-features-chips">
                    {product.features.slice(0, 2).map((feat, fIdx) => (
                      <span key={fIdx} className="card-feat-chip" title={feat}>
                        <CheckCircle2 size={11} className="card-feat-icon" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="catalogue-card-footer">
                  <span className="card-price-hint">
                    MOQ: {product.moq || "-"}
                  </span>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="catalogue-view-details-btn"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="empty-results-box">
            <Search size={40} className="empty-icon" />
            <h3>No products found matching filters</h3>
            <p>Try clearing your size, colour, or search filters to see all available items.</p>
            <button className="reset-search-btn" onClick={handleResetFilters}>
              <RefreshCw size={15} /> Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
