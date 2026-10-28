import { Product } from "../models/Product.js";
import { Enquiry } from "../models/Enquiry.js";
import { Document } from "../models/Document.js";

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
