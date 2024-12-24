// /apps/api/src/routes/ingredient/barcode.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  lookupProductByBarcode,
  decodeBarcodeImageFallback,
} = require('../../services/ingredients/barcodeService');

const barcodeRouter = express.Router();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/barcodes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration with file type validation
const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/png'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error('Invalid file type. Please upload a JPEG or PNG image.')
      );
    }
    cb(null, true);
  },
});

/**
 * GET /ingredients/barcode/lookup?barcode=123456
 */
barcodeRouter.get('/lookup', async (req, res) => {
  try {
    const { barcode } = req.query;
    if (!barcode) {
      return res
        .status(400)
        .json({ error: 'Please provide a barcode in the query parameter.' });
    }
    const data = await lookupProductByBarcode(barcode, req.user.userId);
    return res.json(data);
  } catch (error) {
    console.error('Error in GET /barcode/lookup:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /ingredients/barcode/decode
 */
barcodeRouter.post(
  '/decode',
  upload.single('barcodeImage'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Please upload an image file containing the barcode.',
        });
      }
      const data = await decodeBarcodeImageFallback(
        req.file.path,
        req.user.userId
      );
      return res.json(data);
    } catch (error) {
      console.error('Error in POST /barcode/decode:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = barcodeRouter;
