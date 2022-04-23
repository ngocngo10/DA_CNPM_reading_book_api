const Book = require('../models/book.model');
const User = require('../models/user.model');
const createError = require('http-errors');
const { ObjectID } = require('typeorm');

async function createBook(req, res,next) {
  try {
    const { bookName, category, description, coverImageURL, price } = req.body;

    const author = await User.findById(req.user._id);
    if (!author) {
      return next(createError(404));
    }
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

async function getBookDetail(req, res,next) {
  try {
    const bookId = req.params.bookId
    const book = await Book.findById(bookId)
      .populate({
        path: 'author',
        select: '_id fullName email'
      })
      .populate('chapters');
    if (!book) {
      return next(createError(404));
    }
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

async function searchBook(req, res,next) {
  try {
    const { bookId, authorId, category  } = req.query;
    const findOpiton = {};
    if (bookId) {
      findOpiton._id = bookId;
    }
    if (authorId) {
      findOpiton.author = ObjectID(authorId);
    }
    if (category) {
      findOpiton.category = { $regex: '.*' + category + '.*' };
    }
    const books = await Book.find(findOpiton)
      .populate({
        path: 'author',
        select: '_id fullName email'
      })
      .populate('chapters')
    res.status(201).json(books);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBook,
  getBookDetail,
  searchBook
}
