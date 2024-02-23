import multer from "multer";
import path from "path";

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Custom filename for uploaded files
  }
});

const fileFilter = (req, file, cb) => {
    // Check file types here
    const allowedTypes = /.*/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images, videos, text files, and other specified file types are allowed!'));
    }
};


// Create multer instance with storage settings and file filter
const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Middleware function for handling file upload
const uploadMiddleware = fileUpload.fields([
  { name: 'text', maxCount: 1 }, // For text data
  { name: 'images', maxCount: 5 }, // For images (up to 5 files)
  { name: 'videos', maxCount: 3 }, // For videos (up to 3 files)
  { name: 'files', maxCount: 10 } // For other files (up to 10 files)
]);

// Export the middleware as default
export default fileUpload;
