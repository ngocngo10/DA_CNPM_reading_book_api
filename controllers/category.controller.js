const Category = require('../models/category.model');
const createError = require('http-errors');

async function createCategory(req, res, next) {
  try {
    const categoryName = req.body.categoryName;

    const category = await Category.create({
      categoryName
    });
    res.status(201).json({
      _id: category._id,
      category: category.categoryName    
    });
  } catch (error) {
    next(error);
  }
}

async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.find().exec();
    if (!categories) {
      return next(createError(404));
    }
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCategory,
  getAllCategories
}
