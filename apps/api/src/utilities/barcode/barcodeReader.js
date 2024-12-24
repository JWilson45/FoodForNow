const Quagga = require('@ericblade/quagga2');
const axios = require('axios');

/**
 * Reads a barcode from an image file and fetches product data from Open Food Facts.
 * @param {string} imagePath - Path to the image file containing the barcode.
 * @returns {Promise<Object>} Parsed product data or an error message.
 */
const readBarcode = async (imagePath) => {
  return new Promise((resolve, reject) => {
    Quagga.decodeSingle(
      {
        src: imagePath,
        numOfWorkers: 0, // Use 0 for Node.js
        inputStream: {
          size: 800, // Resize image for better performance
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
      },
      async (result) => {
        if (result && result.codeResult) {
          const barcode = result.codeResult.code;
          console.log('Decoded barcode:', barcode);

          try {
            const response = await axios.get(
              `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
            );
            const product = response.data?.product;

            if (product) {
              const ingredientData = {
                name: product.product_name?.toLowerCase().trim(),
                description: product.ingredients_text?.trim() || null,
                calories: product.nutriments?.['energy-kcal_value'] || null,
                nutritionalInfo: {
                  fat: product.nutriments?.fat_value || null,
                  protein: product.nutriments?.proteins_value || null,
                  carbohydrates:
                    product.nutriments?.carbohydrates_value || null,
                  fiber: product.nutriments?.fiber_value || null,
                  sodium: product.nutriments?.sodium_value || null,
                  salt: product.nutriments?.salt_value || null,
                },
                servingUnit: product.serving_size || null,
              };

              resolve(ingredientData);
            } else {
              resolve({
                error: 'Product not found in Open Food Facts database.',
              });
            }
          } catch (error) {
            reject(`Error fetching product details: ${error.message}`);
          }
        } else {
          resolve({ error: 'No barcode found.' });
        }
      }
    );
  });
};

module.exports = readBarcode;
