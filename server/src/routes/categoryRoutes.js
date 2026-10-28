import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

// Public: list all categories
router.get("/", getCategories);

// Protected: Admin category operations
router.post("/", requireAdminAuth, createCategory);
router.put("/:id", requireAdminAuth, updateCategory);
router.delete("/:id", requireAdminAuth, deleteCategory);

export default router;
