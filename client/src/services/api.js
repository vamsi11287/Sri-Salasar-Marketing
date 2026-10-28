const getRawApiUrl = () => {
  return "https://sri-salasar-marketing.onrender.com";
};

const rawApiUrl = getRawApiUrl().replace(/\/+$/, "");
const API_BASE_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
const SERVER_URL = API_BASE_URL;

const readResponse = async (response, action) => {
  const data = await response.json();
  if (!response.ok || !data || data.success === false) {
    throw new Error(data.message || `${action} failed (Status: ${response.status})`);
  }
  return data;
};

export const getFullFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const api = {
  // PRODUCTS
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`);
    const data = await readResponse(res, "Fetching products");
    return data.data;
  },

  async getFilterOptions() {
    const res = await fetch(`${API_BASE_URL}/products/filters`);
    const data = await readResponse(res, "Fetching product filters");
    return data.data;
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await readResponse(res, "Fetching product");
    return data.data;
  },

  async createProduct(productData, token) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to save product to database (Status: ${res.status})`);
    }
    return data;
  },

  async updateProduct(id, productData, token) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to update product in database (Status: ${res.status})`);
    }
    return data;
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to delete product from database (Status: ${res.status})`);
    }
    return data;
  },

  async uploadProductImage(formData, token) {
    const res = await fetch(`${API_BASE_URL}/products/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Image upload failed (Status: ${res.status})`);
    }
    return data;
  },

  async deleteProductImage(imageUrl, productId, token, publicId = "") {
    const res = await fetch(`${API_BASE_URL}/products/delete-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl, productId, publicId })
    });
    return await readResponse(res, "Deleting image from Cloudinary");
  },

  // CATEGORIES
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await readResponse(res, "Fetching categories");
      return Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.warn("Could not fetch categories from backend:", err.message);
      return [];
    }
  },

  async createCategory(categoryData, token) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to create category (Status: ${res.status})`);
    }
    return data;
  },

  async updateCategory(id, categoryData, token) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to update category (Status: ${res.status})`);
    }
    return data;
  },

  async deleteCategory(id, token) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to delete category (Status: ${res.status})`);
    }
    return data;
  },

  // ENQUIRIES
  async submitEnquiry(enquiryData) {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiryData)
    });
    return readResponse(res, "Submitting enquiry");
  },

  async getEnquiries(token) {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return readResponse(res, "Fetching enquiries");
  },

  // DOCUMENTS & CATALOGUE
  async getDocuments(category) {
    const url = category
      ? `${API_BASE_URL}/documents?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/documents`;
    const res = await fetch(url);
    const data = await readResponse(res, "Fetching documents");
    return data.data;
  },

  async getMasterCatalogue() {
    const res = await fetch(`${API_BASE_URL}/documents/master-catalogue`);
    const data = await readResponse(res, "Fetching master catalogue");
    return data.data;
  },

  async uploadDocument(formData, token) {
    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return readResponse(res, "Uploading document");
  },

  async deleteDocument(id, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      return await readResponse(res, "Deleting document");
    } catch (err) {
      throw err;
    }
  },

  // AUTH
  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  }
};
