// /apps/api/src/utilities/barcode/multerConfig.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '../../uploads/barcodes');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration with file type validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use original filename or generate a unique one
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const validMimeTypes = ['image/jpeg', 'image/png'];
  if (!validMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type. Please upload a JPEG or PNG image.')
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

const uploadMiddleware = upload.single('barcodeImage');

module.exports = {
  uploadMiddleware,
};
