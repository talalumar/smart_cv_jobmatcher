import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadResume, getUserResumes } from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);
router.get("/user", authMiddleware, getUserResumes);

export default router;