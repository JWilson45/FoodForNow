// /apps/api/src/utilities/barcode/barcodeReader.js

const Quagga = require('@ericblade/quagga2');
const axios = require('axios');

/**
 * Decodes a barcode from an image file.
 * @param {string} imagePath - Path to the image file containing the barcode.
 * @returns {Promise<string>} - Decoded barcode string.
 */
const decodeBarcode = (imagePath) => {
  return new Promise((resolve, reject) => {
    try {
      Quagga.decodeSingle(
        {
          src: imagePath,
          numOfWorkers: 0, // Use 0 for Node.js
          inputStream: {
            size: 1280, // Resize image for better performance
          },
          locator: {
            halfSample: true, // Faster processing for large images
          },
          decoder: {
            readers: [
              'code_128_reader',
              'ean_reader',
              'upc_reader',
              'upc_e_reader',
              'code_39_reader',
            ],
          },
          locate: true, // Locate the barcode in the image
        },
        (result) => {
          if (result && result.codeResult && result.codeResult.code) {
            resolve(result.codeResult.code);
          } else {
            reject(new Error('No barcode found in the image.'));
          }
        }
      );
    } catch (error) {
      console.error('Error in Quagga decoding:', error.message);
      reject(new Error('Failed to process the image.'));
    }
  });
};

/**
 * Fetches product data from Open Food Facts using the barcode.
 * @param {string} barcode - The decoded barcode.
 * @returns {Promise<Object>} - Parsed product data.
 */
const fetchProductData = async (barcode) => {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const product = response.data?.product;

    if (product) {
      return {
        name: product.product_name?.toLowerCase().trim(),
        description: product.ingredients_text?.trim() || null,
        calories: product.nutriments?.['energy-kcal_value'] || null,
        nutritionalInfo: {
          fat: product.nutriments?.fat_value || null,
          protein: product.nutriments?.proteins_value || null,
          carbohydrates: product.nutriments?.carbohydrates_value || null,
          fiber: product.nutriments?.fiber_value || null,
          sodium: product.nutriments?.sodium_value || null,
          salt: product.nutriments?.salt_value || null,
        },
        servingUnit: product.serving_size || null,
      };
    } else {
      throw new Error('Product not found in Open Food Facts database.');
    }
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    throw new Error(`Error fetching product details: ${error.message}`);
  }
};

module.exports = {
  decodeBarcode,
  fetchProductData,
};
