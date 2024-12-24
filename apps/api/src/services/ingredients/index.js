// /apps/api/src/services/ingredients/index.js

const fs = require('fs').promises;
const {
  fetchProductData,
  decodeBarcode,
} = require('../../utilities/barcode/barcodeReader');
const { uploadMiddleware } = require('../../utilities/barcode/multerConfig');
const Ingredient = require('../database/models/ingredient');

/**
 * Creates a new ingredient.
 */
const createIngredient = async (req, res) => {
  try {
    const { name, description, calories, image, nutritionalInfo } = req.body;

    const newIngredient = new Ingredient({
      name,
      description,
      calories,
      image,
      nutritionalInfo,
      createdBy: req.user.userId,
    });

    await newIngredient.save();

    res.status(201).json({
      message: 'Ingredient created successfully',
      ingredient: {
        id: newIngredient._id,
        name: newIngredient.name,
        description: newIngredient.description,
        calories: newIngredient.calories,
        nutritionalInfo: newIngredient.nutritionalInfo,
        createdAt: newIngredient.createdAt,
        updatedAt: newIngredient.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ingredient already exists',
        keyPattern: error.keyPattern,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error(error);
    res.status(500).json({
      error: 'An unexpected error occurred while creating the ingredient',
    });
  }
};

/**
 * Retrieves all ingredients.
 */
const getIngredients = async (_, res) => {
  try {
    const ingredients = await Ingredient.find({}).lean();

    res.status(200).json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the ingredients',
    });
  }
};

/**
 * Retrieves a single ingredient by ID.
 */
const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.status(200).json({ ingredient });
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the ingredient' });
  }
};

/**
 * Updates an existing ingredient by ID.
 */
const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.status(200).json({
      message: 'Ingredient updated successfully',
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res
      .status(500)
      .json({ error: 'An error occurred while updating the ingredient' });
  }
};

/**
 * Looks up or creates an ingredient based on a barcode.
 */
const lookupProductByBarcode = async (barcode, userId) => {
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
};

/**
 * Decodes a barcode from an uploaded image and creates an ingredient.
 */
const decodeBarcodeImageFallback = async (imagePath, userId) => {
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
};

/**
 * Handler for GET /ingredients/barcode/lookup
 */
const barcodeLookupHandler = async (req, res) => {
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
};

/**
 * Handler for POST /ingredients/barcode/decode
 */
const barcodeDecodeHandler = (req, res) => {
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
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  barcodeLookupHandler,
  barcodeDecodeHandler,
};
