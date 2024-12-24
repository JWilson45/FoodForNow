// /apps/api/src/services/ingredients/barcodeService.js

const fs = require('fs').promises;
const {
  fetchProductData,
  decodeBarcode,
} = require('../../utilities/barcode/barcodeReader');
const Ingredient = require('../database/models/ingredient');

/**
 * Looks up or creates an ingredient based on a barcode.
 */
async function lookupProductByBarcode(barcode, userId) {
  let ingredient = await Ingredient.findOne({ barcodeNumber: barcode });
  if (ingredient) {
    return { message: 'Ingredient already exists', ingredient };
  }

  const productData = await fetchProductData(barcode);
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
    return await lookupProductByBarcode(barcode, userId);
  } catch (error) {
    console.error('Error in decoding barcode image:', error.message);
    await fs.unlink(imagePath).catch(() => null); // Ensure file cleanup
    throw new Error(`Failed to decode barcode: ${error.message}`);
  }
}

module.exports = {
  lookupProductByBarcode,
  decodeBarcodeImageFallback,
};
