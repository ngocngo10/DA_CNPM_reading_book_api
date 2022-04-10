const Book = require('../models/book.model');
const User = require('../models/user.model');

// @desc    create book
// @route   POST /api/book
// @access  staff, user
async function createBook(req, res,next) {
  try {
    const { bookName, authorId, category, description, coverImageURL, price } = req.body;
    const author = await User.findById(authorId);
    console.log(req.body, author);
    const book = await Book.create({
      bookName,
      author,
      category,
      description,
      coverImageURL,
      price,
    });
    res.status(201).json({
      _id: book._id,
      bookName: book.bookName,
      category: book.category,
      description: book.description,
      coverImageURL: book.coverImageURL,
      price: book.price
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBook
}
