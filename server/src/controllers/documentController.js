import { dataStore } from "../services/dataStore.js";
import {
  isCloudinaryConfigured,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromCloudinaryUrl
} from "../services/cloudinary.js";

// GET /api/documents
export const getDocuments = async (req, res) => {
  try {
    const { category } = req.query;
    const documents = await dataStore.getDocuments(category);
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching documents" });
  }
};

// GET /api/documents/master-catalogue (Client Requirement #1: Floating Button)
export const getMasterCatalogue = async (req, res) => {
  try {
    const catalogue = await dataStore.getMasterCatalogue();
    res.json({ success: true, data: catalogue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting master catalogue" });
  }
};

// POST /api/documents/upload (Uploads PDF directly to Cloudinary and persists metadata in MongoDB Atlas)
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No document file was uploaded." });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary configuration is required for document storage. Zero local storage permitted."
      });
    }

    const { title, category, description, isCurrentMasterCatalogue, version } = req.body;
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(1) + " MB";

    const source = req.file.buffer || req.file.path;
    const uploadResult = await uploadPdfToCloudinary(source, "sri-salasar-documents");

    const doc = await dataStore.createDocument({
      title: title || req.file.originalname,
      category: category || "Catalogue",
      fileName: req.file.originalname,
      filePath: uploadResult.url,
      cloudinaryPublicId: uploadResult.public_id,
      fileSize: fileSizeMB,
      version: version || "",
      description: description || "",
      isCurrentMasterCatalogue: String(isCurrentMasterCatalogue) === "true"
    });

    res.status(201).json({
      success: true,
      message: `${category || "Document"} uploaded successfully to remote Cloudinary storage & MongoDB Atlas!`,
      data: doc
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ success: false, message: "Server error uploading document: " + error.message });
  }
};

// DELETE /api/documents/:id (Deletes document and removes remote PDF from Cloudinary)
export const deleteDocument = async (req, res) => {
  try {
    const doc = await dataStore.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Delete remote file from Cloudinary CDN
    if (doc.cloudinaryPublicId) {
      await deleteFromCloudinary(doc.cloudinaryPublicId, "image");
    } else if (doc.filePath && doc.filePath.includes("cloudinary.com")) {
      const publicId = extractPublicIdFromCloudinaryUrl(doc.filePath);
      if (publicId) {
        await deleteFromCloudinary(publicId, "image");
      }
    }

    await dataStore.deleteDocument(req.params.id);
    res.json({ success: true, message: "Document deleted successfully from Cloudinary & database" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ success: false, message: "Error deleting document" });
  }
};
