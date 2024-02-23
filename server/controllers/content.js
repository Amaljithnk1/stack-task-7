// controllers/content.js

import Content from "../models/content.js";
import contentFilter from "../middleware/contentFilter.js"; // Import content filtering middleware
import fileUpload from "../middleware/fileUpload.js"; // Import file upload middleware

// Controller function for uploading content
export const uploadContent = async (req, res) => {
  try {
    // Apply content filtering middleware
    contentFilter(req, res, async (err) => {
      if (err) {
        console.error("Error filtering content:", err);
        return res.status(400).json({ success: false, message: "Error filtering content" });
      }

      // Process file upload using the file upload middleware
      fileUpload.single('file')(req, res, async (err) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(400).json({ success: false, message: "Error uploading file" });
        }

        try {
          // Extract content data from the request
          const { contentType, contentData } = req.body;
          console.log('Received Content Type:', contentType);
          console.log('Received Content Data:', contentData);

          // Create a new content document in the database
          const newContent = await Content.create({
            contentType,
            contentData: req.file ? req.file.path : contentData, // Use uploaded file path if available
            timestamp: Date.now(),
          });

          console.log('New content created:', newContent); // Log newly created content

          // Return success response
          res.status(201).json({ success: true, message: "Content uploaded successfully", content: newContent });
        } catch (error) {
          // Handle error
          console.error("Error creating content:", error);
          res.status(500).json({ success: false, message: "Error creating content" });
        }
      });
    });
  } catch (error) {
    // Handle error
    console.error("Error uploading content:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Controller function for fetching content
export const fetchContent = async (req, res) => {
  try {
    // Fetch all content from the database
    const allContent = await Content.find();

    // Return success response with the fetched content
    res.status(200).json({ success: true, content: allContent });
  } catch (error) {
    // Handle error
    console.error("Error fetching content:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
