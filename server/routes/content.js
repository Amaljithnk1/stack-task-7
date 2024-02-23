// routes/content.js

import express from "express";
import fileUpload from "../middleware/fileUpload.js"; // Import the file upload middleware
import contentFilter from "../middleware/contentFilter.js"; // Import the content filter middleware
import { uploadContent, fetchContent } from "../controllers/content.js";

const router = express.Router();

// Route for uploading content with multer middleware for file uploads and content filtering middleware
router.post("/content/upload", fileUpload.single('file'), contentFilter, uploadContent);

// Route for fetching all content
router.get("/fetch", fetchContent);

export default router;
