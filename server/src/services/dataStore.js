import { Product } from "../models/Product.js";
import { Enquiry } from "../models/Enquiry.js";
import { Document } from "../models/Document.js";
import { Category } from "../models/Category.js";

export const dataStore = {
  async getProducts(filter = {}) {
    const query = {};
    if (filter.category && filter.category !== "All Products") {
      query.category = filter.category;
    }
    if (filter.status && filter.status !== "all") {
      query.status = filter.status;
    }
    return Product.find(query).sort({ createdAt: -1 }).lean();
  },

  async getProductById(id) {
    return Product.findById(id).lean();
  },

  async createProduct(data) {
    return new Product(data).save();
  },

  async updateProduct(id, updates) {
    return Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();
  },

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id).lean();
  },

  // CATEGORIES - strictly fetched from database (no local/default categories)
  async getCategories() {
    return Category.find().sort({ order: 1, name: 1, createdAt: 1 }).lean();
  },

  async getCategoryById(id) {
    return Category.findById(id).lean();
  },

  async createCategory(data) {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") }
    }).lean();
    if (existing) {
      throw new Error(`Category "${data.name.trim()}" already exists.`);
    }
    return new Category({
      name: data.name.trim(),
      description: data.description ? data.description.trim() : "",
      color: data.color || "",
      order: typeof data.order === "number" ? data.order : 0
    }).save();
  },

  async updateCategory(id, updates) {
    const oldCat = await Category.findById(id).lean();
    if (!oldCat) {
      throw new Error("Category not found.");
    }

    if (updates.name && updates.name.trim() !== oldCat.name) {
      const trimmed = updates.name.trim();
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmed}$`, "i") }
      }).lean();
      if (duplicate) {
        throw new Error(`Category "${trimmed}" already exists.`);
      }

      // Update products assigned to the old category name
      await Product.updateMany(
        { category: oldCat.name },
        { category: trimmed }
      );
    }

    return Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();
  },

  async deleteCategory(id) {
    return Category.findByIdAndDelete(id).lean();
  },

  async getEnquiries() {
    return Enquiry.find().sort({ createdAt: -1 }).lean();
  },

  async createEnquiry(data) {
    return new Enquiry(data).save();
  },

  async updateEnquiryStatus(id, status) {
    return Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();
  },

  async getDocuments(category) {
    const query = category ? { category } : {};
    return Document.find(query).sort({ createdAt: -1 }).lean();
  },

  async getMasterCatalogue() {
    return Document.findOne({
      category: "Catalogue"
    }).sort({ isCurrentMasterCatalogue: -1, createdAt: -1 }).lean();
  },

  async createDocument(data) {
    if (data.isCurrentMasterCatalogue) {
      await Document.updateMany(
        { isCurrentMasterCatalogue: true },
        { isCurrentMasterCatalogue: false }
      );
    }
    return new Document(data).save();
  },

  async getDocumentById(id) {
    return Document.findById(id).lean();
  },

  async deleteDocument(id) {
    return Document.findByIdAndDelete(id).lean();
  }
};

