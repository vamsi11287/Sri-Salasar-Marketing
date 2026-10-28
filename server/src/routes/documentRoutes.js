import express from "express";
import {
  getDocuments,
  getMasterCatalogue,
  uploadDocument,
  deleteDocument
} from "../controllers/documentController.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getDocuments);
router.get("/master-catalogue", getMasterCatalogue);

// Admin: upload new catalogue PDF or TDS (stored remotely on Cloudinary)
router.post("/upload", requireAdminAuth, upload.single("file"), uploadDocument);

// Admin: delete document (removes from Cloudinary and database)
router.delete("/:id", requireAdminAuth, deleteDocument);

export default router;
