import React, { useState, useEffect } from "react";
import "./styles.css";

// Data
import { api } from "./services/api";

// Components
import FlowToolbar from "./components/FlowToolbar";
import TopContactBar from "./components/TopContactBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductsCarousel from "./components/ProductsCarousel";
import BulkOrdersBanner from "./components/BulkOrdersBanner";
import IndustriesSection from "./components/IndustriesSection";
import ProductsPage from "./components/ProductsPage";
import QuoteSection from "./components/QuoteSection";
import AdminPortal from "./components/AdminPortal";
import MobileFrameModal from "./components/MobileFrameModal";
import ProductDetailModal from "./components/ProductDetailModal";
import SearchModal from "./components/SearchModal";
import AboutSection from "./components/AboutSection";
import QualitySection from "./components/QualitySection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import FloatingCatalogue from "./components/FloatingCatalogue";
import DownloadsSection from "./components/DownloadsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import GallerySection from "./components/GallerySection";

export default function App() {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState("");
  const [enquiries, setEnquiries] = useState([]);

  // Navigation State
  const [currentView, setCurrentView] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quotePrefillProduct, setQuotePrefillProduct] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileFrameOpen, setMobileFrameOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Fetch products from the backend on mount.
  useEffect(() => {
    let isMounted = true;

    api.getProducts().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setProducts(data);
      }
    }).catch((error) => {
      if (isMounted) {
        console.error("Could not load products from the database:", error);
        setProductsError("Products could not be loaded. Please try again later.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle new enquiry added through Quote Form
  const handleNewEnquiry = (newEnq) => {
    setEnquiries((prev) => [newEnq, ...prev]);
  };

  // Switch view with smooth scroll to top
  const handleViewChange = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
  };

  const handleQuoteClick = (prod = null) => {
    if (prod) setQuotePrefillProduct(prod);
    handleViewChange("quote");
  };

  return (
    <div className="app-root-wrapper">
      {/* 1. Top Perspective Switcher for Testing */}
      <FlowToolbar
        currentView={currentView}
        setCurrentView={handleViewChange}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenMobileFrame={() => setMobileFrameOpen(true)}
      />

      {/* 2. Top Contact Information Bar */}
      <TopContactBar onQuoteClick={() => handleQuoteClick()} />

      {/* 3. Sticky Corporate Navbar */}
      <Navbar
        products={products}
        currentView={currentView}
        setCurrentView={handleViewChange}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 4. Main Body Layout depending on current view */}
      <main className="main-content-flow">
        {productsError && <p role="alert">{productsError}</p>}
        {currentView === "home" && (
          <>
            <Hero
              onExploreClick={() => handleViewChange("products")}
              onQuoteClick={() => handleQuoteClick()}
            />
            <ProductsCarousel
              products={products}
              onSelectProduct={handleSelectProduct}
              onViewAllProducts={() => handleViewChange("products")}
            />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
            <GallerySection />
            <IndustriesSection
              onExploreSupplies={() => handleViewChange("products")}
            />
            <DownloadsSection />
            <TestimonialsSection />
            <QuoteSection
              products={products}
              onNewEnquirySubmitted={handleNewEnquiry}
              prefilledProduct={quotePrefillProduct}
            />
          </>
        )}

        {currentView === "products" && (
          <>
            <ProductsPage
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelectProduct={handleSelectProduct}
              onQuoteClick={() => handleQuoteClick()}
            />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "downloads" && (
          <>
            <DownloadsSection />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "gallery" && (
          <>
            <GallerySection />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "testimonials" && (
          <>
            <TestimonialsSection />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "about" && (
          <>
            <AboutSection onQuoteClick={() => handleQuoteClick()} />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "industries" && (
          <>
            <IndustriesSection
              onExploreSupplies={() => handleViewChange("products")}
            />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "quality" && (
          <>
            <QualitySection onQuoteClick={() => handleQuoteClick()} />
            <DownloadsSection />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "blog" && (
          <>
            <BlogSection onSelectPost={() => {}} />
            <BulkOrdersBanner onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "contact" && (
          <>
            <ContactSection onQuoteClick={() => handleQuoteClick()} />
          </>
        )}

        {currentView === "quote" && (
          <div className="standalone-quote-view animate-fadeIn">
            <QuoteSection
              products={products}
              onNewEnquirySubmitted={handleNewEnquiry}
              prefilledProduct={quotePrefillProduct}
            />
          </div>
        )}
      </main>

      {/* Corporate Footer (Maps, GST, Hours) */}
      <Footer onNavigate={handleViewChange} />

      {/* Floating Action Buttons */}
      {/* 1. Floating Catalogue with Call & WhatsApp modal (Requirement #1) */}
      <FloatingCatalogue />

      {/* 2. Floating WhatsApp direct trigger */}
      <FloatingWhatsApp />

      {/* Modals & Overlays */}
      {/* A. Product Technical Specification & Size Chart Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuoteRequest={(prod) => handleQuoteClick(prod)}
        />
      )}

      {/* B. Live Product Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* C. Admin Portal Modal with CRUD, Price Updates & PDF Upload */}
      {adminOpen && (
        <AdminPortal
          products={products}
          setProducts={setProducts}
          enquiries={enquiries}
          setEnquiries={setEnquiries}
          onClose={() => setAdminOpen(false)}
        />
      )}

      {/* D. Interactive Mobile Phone Frame Modal */}
      {mobileFrameOpen && (
        <MobileFrameModal
          products={products}
          onClose={() => setMobileFrameOpen(false)}
          onSelectProduct={handleSelectProduct}
          onGetQuote={() => handleQuoteClick()}
        />
      )}
    </div>
  );
}
