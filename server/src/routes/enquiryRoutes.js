import express from "express";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
} from "../controllers/enquiryController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

// Public: user submits enquiry
router.post("/", createEnquiry);

// Admin: view and update enquiry status
router.get("/", requireAdminAuth, getEnquiries);
router.patch("/:id/status", requireAdminAuth, updateEnquiryStatus);

export default router;
