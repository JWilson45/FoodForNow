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
 * Handles barcode lookup.
 * @route GET /ingredients/barcode/lookup
 */
const handleBarcodeLookup = async (req, res) => {
  try {
    const { barcode } = req.query;

    if (!barcode) {
      return res
        .status(400)
        .json({ error: 'Please provide a barcode in the query parameter.' });
    }

    let ingredient = await Ingredient.findOne({ barcodeNumber: barcode });
    if (ingredient) {
      return res.status(200).json({
        message: 'Ingredient already exists',
        ingredient,
      });
    }

    const productData = await fetchProductData(barcode);
    if (!productData) {
      return res
        .status(404)
        .json({ error: 'Product not found for the provided barcode.' });
    }

    ingredient = new Ingredient({
      ...productData,
      barcodeNumber: barcode,
      createdBy: req.user.userId,
    });

    await ingredient.save();

    res.status(201).json({
      message: 'Ingredient created successfully from barcode lookup',
      ingredient,
    });
  } catch (error) {
    console.error('Error in handleBarcodeLookup:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handles barcode decoding and ingredient creation.
 * @route POST /ingredients/barcode/decode
 */
const handleBarcodeDecode = (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Error in file upload:', err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Please upload an image containing the barcode.' });
    }

    try {
      const barcode = await decodeBarcode(req.file.path);

      // Cleanup the uploaded file
      await fs.unlink(req.file.path);

      if (!barcode) {
        return res
          .status(404)
          .json({ error: 'No barcode detected in the uploaded image.' });
      }

      let ingredient = await Ingredient.findOne({ barcodeNumber: barcode });
      if (ingredient) {
        return res.status(200).json({
          message: 'Ingredient already exists',
          ingredient,
        });
      }

      const productData = await fetchProductData(barcode);
      if (!productData) {
        return res
          .status(404)
          .json({ error: 'Product not found for the decoded barcode.' });
      }

      ingredient = new Ingredient({
        ...productData,
        barcodeNumber: barcode,
        createdBy: req.user.userId,
      });

      await ingredient.save();

      res.status(201).json({
        message: 'Ingredient created successfully from barcode decode',
        ingredient,
      });
    } catch (error) {
      console.error('Error in handleBarcodeDecode:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  handleBarcodeLookup,
  handleBarcodeDecode,
};
