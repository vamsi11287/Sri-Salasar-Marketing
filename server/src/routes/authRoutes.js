import express from "express";
import { adminLogin, verifyAdminSession } from "../controllers/authController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", requireAdminAuth, verifyAdminSession);

export default router;
