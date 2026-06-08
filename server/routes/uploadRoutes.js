const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// Determine upload strategy based on environment
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

let upload;
let cloudinary;

if (useCloudinary) {
  // Cloudinary mode: use memory storage
  cloudinary = require('../config/cloudinary');
  const storage = multer.memoryStorage();
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
} else {
  // Local mode: use disk storage
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
    },
  });
}

// @desc    Upload image(s)
// @route   POST /api/upload
// @access  Seller / Admin
router.post('/', verifyToken, roleGuard('seller', 'admin'), upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    let urls;

    if (useCloudinary) {
      // Upload to Cloudinary
      urls = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'shopnest/products' },
              (err, result) => (err ? reject(err) : resolve(result.secure_url))
            );
            stream.end(file.buffer);
          });
        })
      );
    } else {
      // Local storage — return file paths
      urls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    res.json({ success: true, data: { urls } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
