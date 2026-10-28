import React from "react";
import {
  Monitor,
  Smartphone,
  ShoppingBag,
  FileText,
  LayoutDashboard,
  Layers,
  Sparkles
} from "lucide-react";

export default function FlowToolbar({
  currentView,
  setCurrentView,
  onOpenAdmin,
  onOpenMobileFrame
}) {
  return (
    <aside className="flow-switcher-strip" aria-label="Mockup Flow Switcher">
      <div className="flow-switcher-container">
        <div className="flow-label">
          <Sparkles size={14} className="flow-sparkle" />
          <span className="flow-tag">DESIGN BOARD FLOWS:</span>
        </div>

        <div className="flow-buttons-group">
          <button
            className={`flow-btn ${currentView === "home" ? "active-flow" : ""}`}
            onClick={() => setCurrentView("home")}
            title="Desktop Landing & Homepage Flow"
          >
            <Monitor size={14} />
            <span>1. Main Website</span>
          </button>

          <button
            className={`flow-btn ${currentView === "products" ? "active-flow" : ""}`}
            onClick={() => setCurrentView("products")}
            title="Products Catalogue Page Flow"
          >
            <ShoppingBag size={14} />
            <span>2. Products Page</span>
          </button>

          <button
            className={`flow-btn ${currentView === "quote" ? "active-flow" : ""}`}
            onClick={() => setCurrentView("quote")}
            title="Request a Quote Form Flow"
          >
            <FileText size={14} />
            <span>3. Quote Form</span>
          </button>

          <button
            className="flow-btn mobile-preview-btn"
            onClick={onOpenMobileFrame}
            title="Inspect Mobile View Phone Mockup"
          >
            <Smartphone size={14} />
            <span>4. Mobile View</span>
          </button>

          <button
            className="flow-btn admin-flow-btn"
            onClick={onOpenAdmin}
            title="Admin Dashboard Portal"
          >
            <LayoutDashboard size={14} />
            <span>5. Admin Portal</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
