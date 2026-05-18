import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import Resume from "../models/Resume.js"; 
import { uploadResume, getUserResumes } from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);
router.get("/user", authMiddleware, getUserResumes);
router.get("/latest", authMiddleware, async (req, res) => {
  try {

    const resume = await Resume.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });


    if (!resume) {
      return res.status(404).json({ success: false, message: "No resume found" });
    }

    res.status(200).json({ success: true, data: resume });

  } catch (err) {
    console.error("Latest resume route ERROR:", err.message); 
    res.status(500).json({ message: err.message });
  }
});

export default router;