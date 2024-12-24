// /apps/api/src/services/ingredients/barcodeService.js

const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const {
  fetchProductData,
  decodeBarcode,
} = require('../../utilities/barcode/barcodeReader');
const Ingredient = require('../database/models/ingredient');

// Multer configuration for file uploads
const uploadDir = path.join(__dirname, '../../uploads/barcodes');
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
 * Middleware to handle file uploads for barcode decoding.
 * This function returns the multer middleware.
 */
const uploadMiddleware = upload.single('barcodeImage');

/**
 * Looks up or creates an ingredient based on a barcode.
 */
async function lookupProductByBarcode(barcode, userId) {
  let ingredient = await Ingredient.findOne({ barcodeNumber: barcode });
  if (ingredient) {
    return { message: 'Ingredient already exists', ingredient };
  }

  const productData = await fetchProductData(barcode);
  if (!productData) {
    throw new Error('Product data not found for the provided barcode.');
  }

  ingredient = new Ingredient({
    name: productData.name,
    description: productData.description,
    calories: productData.calories,
    nutritionalInfo: productData.nutritionalInfo,
    servingUnit: productData.servingUnit,
    barcodeNumber: barcode,
    createdBy: userId,
  });
  await ingredient.save();

  return { message: 'Ingredient imported successfully', ingredient };
}

/**
 * Decodes a barcode from an uploaded image and creates an ingredient.
 */
async function decodeBarcodeImageFallback(imagePath, userId) {
  try {
    const barcode = await decodeBarcode(imagePath);
    await fs.unlink(imagePath); // Cleanup file
    if (!barcode) {
      throw new Error('No barcode detected in the image.');
    }
    return await lookupProductByBarcode(barcode, userId);
  } catch (error) {
    console.error('Error in decoding barcode image:', error.message);
    await fs.unlink(imagePath).catch(() => null); // Ensure file cleanup
    throw new Error(`Failed to decode barcode: ${error.message}`);
  }
}

/**
 * Handler for GET /ingredients/barcode/lookup
 */
async function barcodeLookupHandler(req, res) {
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
    console.error('Error in barcodeLookupHandler:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handler for POST /ingredients/barcode/decode
 */
async function barcodeDecodeHandler(req, res) {
  // Apply the multer middleware to handle file upload
  uploadMiddleware(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Unknown upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Please upload an image file containing the barcode.',
      });
    }

    try {
      const data = await decodeBarcodeImageFallback(
        req.file.path,
        req.user.userId
      );
      return res.json(data);
    } catch (error) {
      console.error('Error in barcodeDecodeHandler:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });
}

module.exports = {
  barcodeLookupHandler,
  barcodeDecodeHandler,
};
