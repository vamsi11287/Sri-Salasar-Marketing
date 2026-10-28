import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Package } from "lucide-react";

export default function SearchModal({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = products.filter((p) =>
    `${p.name} ${p.category} ${p.detail} ${p.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div
        className="search-modal-card animate-slideDown"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all products (e.g. cable ties, shrink film, 2 inch tape)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-modal-input"
          />
          <button className="search-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="search-modal-results">
          {query.trim() === "" ? (
            <div className="search-suggestions-box">
              <span className="suggestions-title">Popular Searches:</span>
              <div className="suggestions-pills">
                {["Cable Ties", "PVC Clamps", "Shrink Film", "Packing Tapes", "Teflon Tapes", "Patti Roll"].map(
                  (tag) => (
                    <button
                      key={tag}
                      className="suggestion-tag"
                      onClick={() => setQuery(tag)}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="results-list">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="search-result-row"
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="result-thumb"
                  />
                  <div className="result-info">
                    <span className="result-category">{product.category}</span>
                    <strong className="result-name">{product.name}</strong>
                    <span className="result-detail">{product.detail}</span>
                  </div>
                  <div className="result-action">
                    <span className="view-text">View Specs</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-search-results">
              <p>No products matching "<strong>{query}</strong>"</p>
              <small>Try searching for cable ties, clamps, adhesive tapes, or films.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
