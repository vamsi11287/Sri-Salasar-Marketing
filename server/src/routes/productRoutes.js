import express from "express";
import {
  getProducts,
  getProductById,
  getFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} from "../controllers/productController.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { isCloudinaryConfigured, uploadToCloudinary } from "../services/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/filters", getFilterOptions);
router.get("/:id", getProductById);

// Admin protected routes
router.post("/", requireAdminAuth, createProduct);
router.put("/:id", requireAdminAuth, updateProduct);
router.delete("/:id", requireAdminAuth, deleteProduct);
router.post("/delete-image", requireAdminAuth, deleteProductImage);

// Image upload helper route (supports single & multi-image uploads)
router.post("/upload-image", requireAdminAuth, upload.any(), async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : (req.file ? [req.file] : []);
  if (!files.length) {
    return res.status(400).json({ success: false, message: "No image file provided" });
  }

  try {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary configuration is required for image uploads. Zero local storage permitted."
      });
    }

    const uploadedResults = [];

    for (const file of files) {
      const source = file.buffer || file.path;
      const uploadResult = await uploadToCloudinary(source, "sri-salasar-products");
      uploadedResults.push({
        imageUrl: uploadResult.url,
        publicId: uploadResult.public_id,
        originalName: file.originalname,
        source: "cloudinary"
      });
    }

    const primary = uploadedResults[0] || {};
    return res.json({
      success: true,
      images: uploadedResults,
      imageUrl: primary.imageUrl || "",
      publicId: primary.publicId || "",
      count: uploadedResults.length,
      source: "cloudinary"
    });
  } catch (err) {
    console.error("Image upload failed:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed: " + err.message
    });
  }
});


export default router;
