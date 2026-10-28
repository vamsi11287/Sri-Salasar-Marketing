import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from "lucide-react";
import logo from "../assets/sri-salasar-logo.png";

export default function Navbar({
  products = [],
  currentView,
  setCurrentView,
  onOpenSearch,
  onOpenAdmin,
  onSelectCategory
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const productCategories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  const navItems = [
    { id: "home", label: "Home" },
    {
      id: "products",
      label: "Products",
      hasDropdown: true
    },
    { id: "downloads", label: "Downloads & TDS" },
    { id: "gallery", label: "Facility Gallery" },
    { id: "testimonials", label: "Client Reviews" },
    { id: "quality", label: "Quality Standards" },
    { id: "contact", label: "Contact" }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryPick = (cat) => {
    if (onSelectCategory) onSelectCategory(cat);
    setCurrentView("products");
    setProductsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="main-navbar-sticky">
      <div className="navbar-container">
        {/* Brand Logo */}
        <button
          className="brand-logo-btn"
          onClick={() => handleNavClick("home")}
          aria-label="Sri Salasar Marketing Home"
        >
          <img
            src={logo}
            alt="Sri Salasar Marketing - Your Packaging Partner"
            className="brand-logo-img"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-menu">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item-wrapper ${item.hasDropdown ? "has-dropdown" : ""}`}
              onMouseEnter={() => item.hasDropdown && setProductsDropdownOpen(true)}
              onMouseLeave={() => item.hasDropdown && setProductsDropdownOpen(false)}
            >
              <button
                className={`nav-link-btn ${
                  currentView === item.id ? "active-link" : ""
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown
                    size={14}
                    className={`dropdown-caret ${productsDropdownOpen ? "rotated" : ""}`}
                  />
                )}
              </button>

              {/* Products Dropdown Menu */}
              {item.hasDropdown && productsDropdownOpen && (
                <div className="products-dropdown-menu">
                  <div className="dropdown-header">
                    <Package size={15} className="dropdown-header-icon" />
                    <span>Product Categories</span>
                  </div>
                  <div className="dropdown-grid">
                    {productCategories.map((cat) => (
                      <button
                        key={cat}
                        className="dropdown-item-btn"
                        onClick={() => handleCategoryPick(cat)}
                      >
                        <span className="dropdown-dot" />
                        <span className="dropdown-cat-name">{cat}</span>
                      </button>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button
                      className="dropdown-view-all"
                      onClick={() => handleNavClick("products")}
                    >
                      View All Products <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Tools: Search, Admin, Mobile Toggle */}
        <div className="navbar-right-tools">
          <button
            className="nav-icon-tool"
            onClick={onOpenSearch}
            aria-label="Search products"
            title="Search products..."
            id="nav-search-trigger"
          >
            <Search size={18} />
          </button>

          <button
            className="admin-badge-btn"
            onClick={onOpenAdmin}
            title="Open Admin Portal"
            id="nav-admin-trigger"
          >
            <LayoutDashboard size={15} />
            <span className="admin-btn-text">Admin</span>
          </button>

          <button
            onClick={() => handleNavClick("quote")}
            className="nav-quote-btn"
            id="nav-quote-cta"
          >
            Get a Quote <ArrowRight size={14} />
          </button>

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay animate-fadeIn">
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-header">
              <img src={logo} alt="Sri Salasar" className="mobile-drawer-logo" />
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              {navItems.map((item) => (
                <div key={item.id} className="mobile-nav-group">
                  <button
                    className={`mobile-nav-item ${
                      currentView === item.id ? "mobile-active" : ""
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={14} className="mobile-arrow" />
                  </button>

                  {item.hasDropdown && (
                    <div className="mobile-subcategories">
                      {productCategories.slice(0, 5).map((cat) => (
                        <button
                          key={cat}
                          className="mobile-subcat-link"
                          onClick={() => handleCategoryPick(cat)}
                        >
                          • {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <button
                className="mobile-drawer-admin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
              >
                <LayoutDashboard size={16} /> Admin Portal
              </button>
              <button
                className="mobile-drawer-quote"
                onClick={() => handleNavClick("quote")}
              >
                Request a Quote <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
