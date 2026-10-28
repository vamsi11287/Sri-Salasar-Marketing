import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Inbox,
  FileText,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  CheckCircle2,
  Upload,
  Download,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Scale,
  Lock,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import logo from "../assets/sri-salasar-logo.png";
import { api, getFullFileUrl } from "../services/api";

export default function AdminPortal({
  products = [],
  setProducts,
  enquiries = [],
  setEnquiries,
  onClose
}) {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem("ssm-admin-token") || "");
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ssm-admin-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const productCategoryOptions = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Portal Navigation State
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState("");

  // Catalogue Upload State (Requirement #9)
  const [docUploadState, setDocUploadState] = useState({
    title: "",
    category: "Catalogue",
    version: "",
    description: "",
    isMaster: true,
    file: null
  });
  const [uploadNotice, setUploadNotice] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [documentsList, setDocumentsList] = useState([]);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    detail: "",
    price: "",
    moq: "",
    status: "Active",
    description: "",
    image: "",
    images: [],
    material: "",
    loadRating: "",
    sizes: "",
    colors: "",
    features: [],
    cloudinaryPublicId: ""
  });

  const [newFeatureText, setNewFeatureText] = useState("");

  // Feature item handlers
  const handleAddFeature = () => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    const current = Array.isArray(productForm.features) ? productForm.features : [];
    if (!current.includes(trimmed)) {
      setProductForm((prev) => ({
        ...prev,
        features: [...current, trimmed]
      }));
    }
    setNewFeatureText("");
  };

  const handleRemoveFeature = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleQuickAddFeature = (suggestion) => {
    const current = Array.isArray(productForm.features) ? productForm.features : [];
    if (!current.includes(suggestion)) {
      setProductForm((prev) => ({
        ...prev,
        features: [...current, suggestion]
      }));
    }
  };

  // Image Upload & Cloudinary States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [pendingImagePreviews, setPendingImagePreviews] = useState([]);
  const [imageUploadMode, setImageUploadMode] = useState("file");

  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previewUrls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setPendingImagePreviews(previewUrls);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.uploadProductImage(formData, token);
      const newItems = [];

      if (Array.isArray(res?.images) && res.images.length) {
        newItems.push(...res.images);
      } else if (res?.imageUrl) {
        newItems.push({ imageUrl: res.imageUrl, publicId: res.publicId || "" });
      }

      if (!newItems.length) {
        throw new Error(res?.message || "No images returned from Cloudinary upload.");
      }

      setProductForm((prev) => {
        const prevImages = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
        const newUrls = newItems.map((item) => item.imageUrl);
        const combined = [...prevImages, ...newUrls];
        return {
          ...prev,
          images: combined,
          image: combined[0] || "",
          cloudinaryPublicId: prev.cloudinaryPublicId || newItems[0]?.publicId || ""
        };
      });

      triggerNotice(`Successfully uploaded ${newItems.length} image${newItems.length > 1 ? "s" : ""} to Cloudinary CDN.`);
    } catch (err) {
      console.error("Multi-image upload error:", err);
      alert(`Image upload error: ${err.message}. Please check Cloudinary connection.`);
      triggerNotice(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      setPendingImagePreviews([]);
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
      e.target.value = "";
    }
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    setProductForm((prev) => {
      const images = [...(prev.images || [])];
      if (indexToPrimary > 0 && indexToPrimary < images.length) {
        const [selected] = images.splice(indexToPrimary, 1);
        images.unshift(selected);
      }
      return {
        ...prev,
        images,
        image: images[0] || ""
      };
    });
    triggerNotice("Set as primary product photo.");
  };

  const handleRemoveProductImage = async (indexToRemove) => {
    const targetImage = productForm.images?.[indexToRemove];
    if (!targetImage) return;

    const isCloudinary = typeof targetImage === "string" && targetImage.includes("cloudinary.com");
    const prodId = editingProduct ? (editingProduct._id || editingProduct.id) : null;

    // Optimistically update form state
    const remainingImages = (productForm.images || []).filter((_, index) => index !== indexToRemove);
    const newPrimary = remainingImages[0] || "";

    setProductForm((prev) => ({
      ...prev,
      images: remainingImages,
      image: newPrimary,
      cloudinaryPublicId: indexToRemove === 0 ? "" : prev.cloudinaryPublicId
    }));

    // If hosted on Cloudinary, trigger permanent CDN deletion and sync database
    if (isCloudinary) {
      try {
        const res = await api.deleteProductImage(targetImage, prodId, token);
        if (res && res.data) {
          const updated = res.data;
          setProducts((prev) =>
            prev.map((p) => (String(p._id || p.id) === String(prodId) ? { ...p, ...updated } : p))
          );
          if (editingProduct) {
            setEditingProduct((prev) => ({ ...prev, ...updated }));
          }
        }
        triggerNotice("Photo deleted from Cloudinary and product updated.");
      } catch (err) {
        console.error("Cloudinary delete image error:", err);
        triggerNotice(`Photo removed from form (Cloudinary delete warning: ${err.message})`);
      }
    } else {
      triggerNotice("Photo removed from product form.");
    }
  };

  // Check and sync token / documents / enquiries on mount
  useEffect(() => {
    // Load documents
    api.getDocuments().then((docs) => {
      setDocumentsList(Array.isArray(docs) ? docs : []);
    }).catch((error) => {
      console.error("Could not load documents from the database:", error);
      setNotice("Could not load documents from the database.");
    });
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch live enquiries from backend
      api.getEnquiries(token).then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          setEnquiries(res.data);
        }
      }).catch((error) => {
        console.error("Could not load enquiries from the database:", error);
        setNotice("Could not load enquiries from the database.");
      });
    }
  }, [token, activeTab]);

  const triggerNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  // Admin Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await api.adminLogin(loginEmail.trim(), loginPassword.trim());
      if (res && res.success && res.token) {
        localStorage.setItem("ssm-admin-token", res.token);
        if (res.admin) {
          localStorage.setItem("ssm-admin-user", JSON.stringify(res.admin));
          setAdminUser(res.admin);
        }
        setToken(res.token);
        triggerNotice("Admin authenticated successfully. Full privileges unlocked.");
      } else {
        setLoginError(
          res?.message ||
            "Invalid email or password."
        );
      }
    } catch (err) {
      console.error("Admin login request failed:", err);
      setLoginError(err.message || "Could not connect to authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Sign out
  const handleLogout = () => {
    localStorage.removeItem("ssm-admin-token");
    localStorage.removeItem("ssm-admin-user");
    setToken("");
    setAdminUser(null);
    triggerNotice("Logged out of Admin Portal.");
  };

  // Filter products by search
  const displayedProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.detail?.toLowerCase().includes(q)
    );
  });

  // Handle Save (Add or Edit) to Database
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);

    try {
      const cleanFeatures = Array.isArray(productForm.features)
        ? productForm.features.map((f) => (typeof f === "string" ? f.trim() : f)).filter(Boolean)
        : [];

      const images = Array.isArray(productForm.images) && productForm.images.length > 0
        ? productForm.images.filter(Boolean)
        : (productForm.image ? [productForm.image] : []);

      const primaryImage = images[0] || productForm.image || "";

      const payload = {
        ...productForm,
        image: primaryImage,
        images,
        features: cleanFeatures,
        colors:
          typeof productForm.colors === "string"
            ? productForm.colors.split(",").map((c) => c.trim()).filter(Boolean)
            : productForm.colors
      };

      if (editingProduct) {
        const prodId = editingProduct._id || editingProduct.id;
        const res = await api.updateProduct(prodId, payload, token);
        const updated = (res && res.data) ? res.data : payload;
        setProducts((prev) =>
          prev.map((p) => (String(p._id || p.id) === String(prodId) ? { ...p, ...updated } : p))
        );
        triggerNotice(`Saved product "${payload.name}" to database successfully.`);
      } else {
        const res = await api.createProduct(payload, token);
        if (!res?.data) {
          throw new Error(res?.message || "Failed to save product in database.");
        }
        const created = res.data;
        setProducts((prev) => [created, ...prev]);
        triggerNotice(`Product "${payload.name}" saved to database successfully.`);
      }

      // Close modal and reset form only on success
      setShowAddModal(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "",
        detail: "",
        price: "",
        moq: "",
        status: "Active",
        description: "",
        image: "",
        images: [],
        material: "",
        loadRating: "",
        sizes: "",
        colors: "",
        features: [],
        cloudinaryPublicId: ""
      });
      setNewFeatureText("");
    } catch (err) {
      console.error("Save product error:", err);
      alert(`Could not save product to database: ${err.message}`);
      triggerNotice(`Save failed: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || "",
      category: p.category || "",
      detail: p.detail || "",
      price: p.price || "",
      moq: p.moq || "",
      status: p.status || "Active",
      description: p.description || "",
      image: p.image || "",
      images: Array.isArray(p.images) && p.images.length ? [...p.images] : (p.image ? [p.image] : []),
      material: p.material || "",
      loadRating: p.loadRating || "",
      sizes: p.sizes || "",
      colors: Array.isArray(p.colors) ? p.colors.join(", ") : p.colors || "",
      features: Array.isArray(p.features)
        ? [...p.features]
        : (typeof p.features === "string" && p.features.trim()
          ? p.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : []),
      cloudinaryPublicId: p.cloudinaryPublicId || ""
    });
    setNewFeatureText("");
    setImageUploadMode(p.image && p.image.startsWith("http") && !p.image.includes("cloudinary") ? "url" : "file");
    setShowAddModal(true);
  };

  const handleDeleteClick = async (p) => {
    const prodId = p._id || p.id;
    if (window.confirm(`Are you sure you want to delete "${p.name}"? This will also remove the image from Cloudinary.`)) {
      try {
        await api.deleteProduct(prodId, token);
        setProducts((prev) => prev.filter((item) => String(item._id || item.id) !== String(prodId)));
        triggerNotice(`Deleted "${p.name}" and removed image from Cloudinary.`);
      } catch (error) {
        console.error("Delete product failed:", error);
        triggerNotice(`Could not delete "${p.name}": ${error.message}`);
      }
    }
  };

  // Inline Quick Price Change Handler (Requirement #9)
  const handleQuickPriceChange = async (prod, newPrice) => {
    const prodId = prod._id || prod.id;
    setProducts((prev) =>
      prev.map((item) =>
        String(item._id || item.id) === String(prodId) ? { ...item, price: newPrice } : item
      )
    );
    try {
      await api.updateProduct(prodId, { price: newPrice }, token);
      triggerNotice(`Updated price for "${prod.name}" to ${newPrice}`);
    } catch (error) {
      setProducts((prev) =>
        prev.map((item) =>
          String(item._id || item.id) === String(prodId) ? { ...item, price: prod.price } : item
        )
      );
      console.error("Price update failed:", error);
      triggerNotice(`Could not update price for "${prod.name}": ${error.message}`);
    }
  };

  // Catalogue PDF Upload Handler (Requirement #9)
  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!docUploadState.file) {
      alert("Please choose a PDF file to upload.");
      return;
    }

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", docUploadState.file);
    formData.append("title", docUploadState.title || docUploadState.file.name);
    formData.append("category", docUploadState.category);
    formData.append("version", docUploadState.version);
    formData.append("description", docUploadState.description);
    formData.append("isCurrentMasterCatalogue", String(docUploadState.isMaster));

    try {
      const res = await api.uploadDocument(formData, token);
      setUploadingDoc(false);
      setUploadNotice(res.message || "Document uploaded & published to Cloudinary CDN successfully!");
      if (res.data) {
        setDocumentsList((prev) => [res.data, ...prev]);
        setDocUploadState({
          title: "",
          category: "Catalogue",
          version: "",
          description: "",
          isMaster: true,
          file: null
        });
      }
      setTimeout(() => setUploadNotice(""), 4500);
    } catch (err) {
      setUploadingDoc(false);
      setUploadNotice("Upload failed: " + err.message);
      setTimeout(() => setUploadNotice(""), 4000);
    }
  };

  const handleDeleteDoc = async (doc) => {
    const docId = doc._id || doc.id;
    if (window.confirm(`Are you sure you want to delete "${doc.title}"? This will also remove the PDF from Cloudinary.`)) {
      try {
        await api.deleteDocument(docId, token);
        setDocumentsList((prev) => prev.filter((d) => String(d._id || d.id) !== String(docId)));
        triggerNotice(`Deleted "${doc.title}" from Cloudinary and system.`);
      } catch (error) {
        console.error("Delete document failed:", error);
        triggerNotice(`Could not delete "${doc.title}": ${error.message}`);
      }
    }
  };

  // =========================================================================
  // VIEW 1: AUTHENTICATION SCREEN IF NOT LOGGED IN
  // =========================================================================
  if (!token) {
    return (
      <div className="admin-portal-backdrop animate-fadeIn">
        <div className="admin-login-card animate-scaleUp">
          <div className="admin-login-header">
            <button className="login-close-corner" onClick={onClose} title="Close">
              <X size={18} />
            </button>
            <img src={logo} alt="Sri Salasar Marketing" className="admin-login-logo" />
            <div className="admin-login-badge">
              <ShieldCheck size={14} /> Authorized Personnel Only
            </div>
            <h2>Industrial Control Panel Login</h2>
            <p>
              Sign in to manage industrial products, modify live wholesale prices, upload new
              catalogue PDFs, and review customer quotation leads.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            {loginError && (
              <div className="admin-login-error animate-fadeIn">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-field">
              <label>Admin Email</label>
              <input
                type="email"
                required
                placeholder="Enter your admin email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loginLoading} className="admin-login-submit-btn">
              {loginLoading ? (
                <span>Authenticating with Backend...</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <button type="button" className="admin-back-btn" onClick={onClose}>
              <X size={15} /> Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="admin-portal-backdrop animate-fadeIn">
      <div className="admin-portal-container">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <img src={logo} alt="Logo" className="admin-logo-small" />
            <div>
              <span className="admin-portal-tag">SRI SALASAR CONTROL PANEL</span>
              <h2 className="admin-title">Industrial B2B Administration</h2>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-user-pill">
              <span className="online-dot" />
              <span className="user-email">{adminUser?.email}</span>
              <span className="admin-role-tag">Super Admin</span>
            </div>
            <button
              className="admin-logout-btn"
              onClick={handleLogout}
              title="Sign out of Admin Session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
            <button className="admin-exit-btn" onClick={onClose} title="Return to Website">
              <X size={16} />
              <span>Storefront</span>
            </button>
          </div>
        </header>

        {notice && (
          <div className="admin-notice-bar animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="admin-body-layout">
          {/* Sidebar */}
          <nav className="admin-sidebar">
            <button
              className={`sidebar-nav-item ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <ShoppingBag size={18} />
              <span>Products &amp; Prices</span>
              <span className="item-count">{products.length}</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === "catalogue" ? "active" : ""}`}
              onClick={() => setActiveTab("catalogue")}
            >
              <Upload size={18} />
              <span>Upload Catalogue &amp; TDS</span>
              <span className="item-count">{documentsList.length}</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === "enquiries" ? "active" : ""}`}
              onClick={() => setActiveTab("enquiries")}
            >
              <Inbox size={18} />
              <span>Enquiries &amp; Leads</span>
              <span className="item-count">{enquiries.length}</span>
            </button>
          </nav>

          {/* Tab 1: Products & Prices */}
          {activeTab === "products" && (
            <main className="admin-content-area">
              <div className="admin-content-header">
                <div>
                  <h3>Product Inventory &amp; Live Price Management</h3>
                  <p>
                    Add new products, adjust live wholesale prices inline, and configure size charts.
                  </p>
                </div>
                <button
                  className="admin-primary-btn"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddModal(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Search in products */}
              <div className="admin-search-row">
                <div className="admin-search-input">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search products by title, category, or specs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Live Wholesale Price</th>
                      <th>MOQ</th>
                      <th>Material / Specs</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProducts.map((prod) => (
                      <tr key={prod._id || prod.id}>
                        <td>
                          <div className="table-prod-info">
                            {prod.image ? (
                              <img
                                src={getFullFileUrl(prod.image)}
                                alt={prod.name}
                                className="table-prod-thumb"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="table-prod-thumb-empty" title="No image uploaded">
                                <ImageIcon size={18} />
                              </div>
                            )}
                            <div>
                              <strong>{prod.name}</strong>
                              <span className="table-sub">{prod.detail || prod.material}</span>
                              {Array.isArray(prod.features) && prod.features.length > 0 && (
                                <span className="table-features-count" title={prod.features.join(" • ")}>
                                  <Sparkles size={11} /> {prod.features.length} feature{prod.features.length === 1 ? "" : "s"}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="table-cat-badge">{prod.category}</span>
                        </td>
                        <td>
                          {/* Live Editable Price (Requirement #9) */}
                          <div className="price-editable-wrap">
                            <input
                              type="text"
                              defaultValue={prod.price || ""}
                              onBlur={(e) => handleQuickPriceChange(prod, e.target.value)}
                              className="quick-price-input"
                              title="Click to edit price and tab away to save"
                            />
                          </div>
                        </td>
                        <td>{prod.moq || "-"}</td>
                        <td>
                          <span className="table-sub">{prod.material || "-"}</span>
                        </td>
                        <td>
                          <span className="status-badge-active">{prod.status || "-"}</span>
                        </td>
                        <td className="text-right">
                          <button
                            className="table-icon-btn edit-btn"
                            onClick={() => handleEditClick(prod)}
                            title="Edit Product"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="table-icon-btn delete-btn"
                            onClick={() => handleDeleteClick(prod)}
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          )}

          {/* Tab 2: Upload Catalogue PDF & TDS (Requirement #9) */}
          {activeTab === "catalogue" && (
            <main className="admin-content-area">
              <div className="admin-content-header">
                <div>
                  <h3>Upload New Catalogue &amp; Technical Documents</h3>
                  <p>
                    Upload a new PDF to immediately update the master catalogue downloaded by
                    visitors via the floating button.
                  </p>
                </div>
              </div>

              {uploadNotice && (
                <div className="admin-notice-bar animate-fadeIn">
                  <CheckCircle2 size={16} />
                  <span>{uploadNotice}</span>
                </div>
              )}

              <div className="admin-upload-grid">
                {/* Upload Form */}
                <form onSubmit={handleDocUpload} className="admin-card-box upload-form-box">
                  <h4>
                    <Upload size={18} /> Upload Document / PDF
                  </h4>

                  <div className="form-field">
                    <label>Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Salasar Master Product Catalogue (2026 Edition)"
                      value={docUploadState.title}
                      onChange={(e) =>
                        setDocUploadState({ ...docUploadState, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>Document Type</label>
                      <select
                        value={docUploadState.category}
                        onChange={(e) =>
                          setDocUploadState({ ...docUploadState, category: e.target.value })
                        }
                      >
                        <option value="Catalogue">Product Master Catalogue</option>
                        <option value="TDS">Technical Data Sheet (TDS)</option>
                        <option value="Certificate">Compliance Certificate (ISO/RoHS/UL)</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Version / Revision</label>
                      <input
                        type="text"
                        placeholder="e.g. 2026.2"
                        value={docUploadState.version}
                        onChange={(e) =>
                          setDocUploadState({ ...docUploadState, version: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Description / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Updated with newly added 450mm heavy duty ties and new tape rates."
                      value={docUploadState.description}
                      onChange={(e) =>
                        setDocUploadState({ ...docUploadState, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Select PDF File *</label>
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) =>
                        setDocUploadState({ ...docUploadState, file: e.target.files[0] })
                      }
                    />
                  </div>

                  <label className="checkbox-master-label">
                    <input
                      type="checkbox"
                      checked={docUploadState.isMaster}
                      onChange={(e) =>
                        setDocUploadState({ ...docUploadState, isMaster: e.target.checked })
                      }
                    />
                    <span>
                      Set as <strong>Live Master Catalogue</strong> (Floating button on every page
                      will download this PDF)
                    </span>
                  </label>

                  <button type="submit" disabled={uploadingDoc} className="admin-primary-btn">
                    {uploadingDoc ? (
                      <span>Uploading PDF...</span>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>Publish New Catalogue</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Current Active Documents */}
                <div className="admin-card-box docs-list-box">
                  <h4>Current Live Documents ({documentsList.length})</h4>
                  <div className="admin-docs-list">
                    {documentsList.map((doc, idx) => (
                      <div key={doc._id || idx} className="admin-doc-item">
                        <div className="admin-doc-left">
                          <FileText size={20} className="doc-pdf-icon" />
                          <div>
                            <strong>{doc.title}</strong>
                            <div className="doc-item-meta">
                              <span className="badge-cat">{doc.category}</span>
                              <span>{doc.fileSize || "PDF"}</span>
                              {doc.isCurrentMasterCatalogue && (
                                <span className="badge-master">Active Floating PDF</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="doc-item-actions">
                          <a
                            href={getFullFileUrl(doc.filePath)}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-preview-link"
                            title="Open PDF"
                          >
                            <Download size={14} />
                            <span>View</span>
                          </a>
                          <button
                            type="button"
                            className="doc-delete-btn"
                            onClick={() => handleDeleteDoc(doc)}
                            title="Delete Document from Cloudinary & System"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* Tab 3: Enquiries Leads Inbox */}
          {activeTab === "enquiries" && (
            <main className="admin-content-area">
              <div className="admin-content-header">
                <div>
                  <h3>Customer Enquiries &amp; Quotation Leads</h3>
                  <p>Inquiries received from customer website quote requests.</p>
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer / Firm</th>
                      <th>Contact Mobile</th>
                      <th>Location</th>
                      <th>Required Products</th>
                      <th>Quantity</th>
                      <th>Customer Message</th>
                      <th className="text-right">Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq, idx) => (
                      <tr key={enq._id || idx}>
                        <td>
                          <strong>{enq.fullName}</strong>
                          <span className="table-sub">{enq.companyName || "Individual Buyer"}</span>
                        </td>
                        <td>
                          <span className="phone-bold">{enq.phone}</span>
                        </td>
                        <td>{enq.city || "Tamil Nadu"}</td>
                        <td>
                          <span className="table-prods">
                            {Array.isArray(enq.selectedProducts)
                              ? enq.selectedProducts.join(", ")
                              : enq.selectedProducts}
                          </span>
                        </td>
                        <td>
                          <span className="badge-qty">{enq.quantity}</span>
                        </td>
                        <td>
                          <p className="table-msg-preview">{enq.message || "-"}</p>
                        </td>
                        <td className="text-right">
                          <div className="enquiry-actions-row">
                            <a
                              href={`tel:${enq.phone}`}
                              className="lead-action-btn call"
                              title="Call Customer"
                            >
                              <Phone size={14} />
                            </a>
                            <a
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${enq.fullName}, thank you for contacting Sri Salasar Marketing. We received your quote enquiry.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="lead-action-btn wa"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-window animate-scaleUp">
            <div className="admin-modal-header">
              <h3>
                {editingProduct
                  ? `Edit Product: ${editingProduct.name}`
                  : "Add New Industrial Product"}
              </h3>
              <button
                className="cat-close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Category *</label>
                  <input
                    list="admin-product-categories"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  />
                  <datalist id="admin-product-categories">
                    {productCategoryOptions.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Wholesale Price (e.g. ₹0.45 - ₹3.20 / pc) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Minimum Order Qty (MOQ) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.moq}
                    onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Raw Material Specification</label>
                  <input
                    type="text"
                    placeholder="e.g. UL 94V-2 Virgin Nylon 66"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Tensile Load Rating</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.1 kg - 54.4 kg (18 lbs - 120 lbs)"
                    value={productForm.loadRating}
                    onChange={(e) => setProductForm({ ...productForm, loadRating: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 100mm, 150mm, 200mm, 250mm, 300mm"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Colours (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Natural White, UV Black"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field image-upload-field">
                <div className="image-field-header">
                  <label>Product Images</label>
                  <div className="image-mode-toggles">
                    <button
                      type="button"
                      className={`mode-toggle-btn ${imageUploadMode === "file" ? "active" : ""}`}
                      onClick={() => setImageUploadMode("file")}
                    >
                      <Upload size={12} /> Upload File
                    </button>
                    <button
                      type="button"
                      className={`mode-toggle-btn ${imageUploadMode === "url" ? "active" : ""}`}
                      onClick={() => setImageUploadMode("url")}
                    >
                      <LinkIcon size={12} /> Direct URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === "file" ? (
                  <div className="product-image-dropzone">
                    <input
                      type="file"
                      id="product-image-input"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      multiple
                      disabled={uploadingImage}
                      onChange={handleImageFileChange}
                      style={{ display: "none" }}
                    />

                    {(productForm.images || []).length || pendingImagePreviews.length ? (
                      <div className="product-image-gallery">
                        {(productForm.images || []).map((imageUrl, index) => {
                          const isCloud = imageUrl && imageUrl.includes("cloudinary.com");
                          return (
                            <div className="product-image-gallery-item" key={`${imageUrl}-${index}`}>
                              <div style={{ position: "relative", width: "100%" }}>
                                <img
                                  src={getFullFileUrl(imageUrl)}
                                  alt={`Product image ${index + 1}`}
                                  onError={(e) => {
                                    e.currentTarget.style.visibility = "hidden";
                                  }}
                                />
                                {index === 0 ? (
                                  <span style={{
                                    position: "absolute",
                                    top: "4px",
                                    left: "4px",
                                    background: "#f45b16",
                                    color: "#fff",
                                    fontSize: "0.68rem",
                                    fontWeight: "800",
                                    padding: "2px 6px",
                                    borderRadius: "4px"
                                  }}>
                                    ★ Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(index)}
                                    style={{
                                      position: "absolute",
                                      top: "4px",
                                      left: "4px",
                                      background: "rgba(15,23,42,0.85)",
                                      color: "#fff",
                                      fontSize: "0.65rem",
                                      fontWeight: "600",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      border: "none",
                                      cursor: "pointer"
                                    }}
                                    title="Click to make this the main product image"
                                  >
                                    Set Main
                                  </button>
                                )}
                              </div>

                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                  {index === 0 ? "Main Photo" : `Photo ${index + 1}`}
                                </span>
                                {isCloud && (
                                  <span style={{
                                    fontSize: "0.62rem",
                                    fontWeight: "700",
                                    color: "#2563eb",
                                    background: "#eff6ff",
                                    padding: "1px 5px",
                                    borderRadius: "3px"
                                  }}>
                                    Cloudinary
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                className="remove-img-btn"
                                aria-label={`Remove product image ${index + 1}`}
                                onClick={() => handleRemoveProductImage(index)}
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          );
                        })}

                        {pendingImagePreviews.map((preview, index) => (
                          <div className="product-image-gallery-item" key={preview.url || index}>
                            <div style={{ position: "relative", width: "100%" }}>
                              <img src={preview.url} alt={`Uploading ${preview.name || index + 1}`} />
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(15,23,42,0.45)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px"
                              }}>
                                <span style={{
                                  fontSize: "0.68rem",
                                  fontWeight: "700",
                                  color: "#fff",
                                  background: "#f45b16",
                                  padding: "3px 8px",
                                  borderRadius: "4px"
                                }}>
                                  Uploading...
                                </span>
                              </div>
                            </div>
                            <span style={{ fontSize: "0.7rem", color: "#f45b16" }}>Uploading to Cloudinary...</span>
                          </div>
                        ))}

                        <label htmlFor="product-image-input" className="change-img-btn" style={{ cursor: "pointer" }}>
                          <Upload size={13} /> Add More Images
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="product-image-input" className="image-dropzone-box">
                        <div className="dropzone-icon">
                          <Upload size={22} />
                        </div>
                        <div className="dropzone-text">
                          <strong>Choose Images from Device</strong>
                          <span>Select multiple PNG, JPG, or WebP images to upload to Cloudinary</span>
                        </div>
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="direct-url-box">
                    <input
                      type="text"
                      placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={(e) => {
                        const image = e.target.value;
                        setProductForm((prev) => ({
                          ...prev,
                          image,
                          images: image ? [image, ...(prev.images || []).slice(1)] : (prev.images || []).slice(1),
                          cloudinaryPublicId: ""
                        }));
                      }}
                    />
                    {productForm.image && (
                      <div className="url-preview-thumb">
                        <img src={getFullFileUrl(productForm.image)} alt="Preview" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Bullet Features Manager */}
              <div className="form-field admin-features-manager">
                <div className="features-manager-header">
                  <label>
                    <Sparkles size={14} className="feature-header-icon" />
                    Key Bullet Features &amp; Specifications ({(productForm.features || []).length})
                  </label>
                  <span className="field-hint">Features appear as bullet points in the product specs modal</span>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="feature-quick-suggestions">
                  <span className="suggestions-label">Quick Add:</span>
                  {[
                    "UL 94V-2 Flame Retardant",
                    "Virgin Industrial Grade Nylon 66",
                    "UV & Weather Resistant (-40°C to +85°C)",
                    "High Tensile Non-Releasable Lock",
                    "Hardened Steel Masonry Nails",
                    "High Tack Waterproof Adhesion",
                    "RoHS & Heavy Metal Compliant",
                    "Smooth Edge Cable Protection"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="feature-suggestion-chip"
                      onClick={() => handleQuickAddFeature(suggestion)}
                      title="Click to add this feature"
                    >
                      <Plus size={12} /> {suggestion}
                    </button>
                  ))}
                </div>

                {/* Feature Input Row */}
                <div className="feature-input-row">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type a product feature & click Add (or press Enter)..."
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="add-feature-btn"
                    disabled={!newFeatureText.trim()}
                  >
                    <Plus size={15} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Currently Added Features List */}
                <div className="admin-features-list">
                  {(productForm.features || []).length === 0 ? (
                    <div className="no-features-notice">
                      <span>No features added yet. Type a feature above or click a Quick Add chip.</span>
                    </div>
                  ) : (
                    productForm.features.map((feat, fIdx) => (
                      <div key={fIdx} className="admin-feature-item">
                        <div className="feature-item-left">
                          <span className="feature-index">{fIdx + 1}</span>
                          <CheckCircle2 size={14} className="feat-green-icon" />
                          <span className="feature-text">{feat}</span>
                        </div>
                        <button
                          type="button"
                          className="remove-feature-btn"
                          onClick={() => handleRemoveFeature(fIdx)}
                          title="Remove feature"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="form-field">
                <label>Detailed Technical Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={uploadingImage || savingProduct}>
                  {savingProduct ? "Saving to Database..." : (editingProduct ? "Save Changes" : "Create Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
