const { Book } = require('../models/book.model');
const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const createError = require('http-errors');
const { ObjectID } = require('typeorm');

async function createBook(req, res, next) {
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
    const added_book = await Book.findById(book._id).populate({
      path: 'category',
      select: 'categoryName'
    }).exec();
    res.status(201).json({
      _id: added_book._id,
      bookName: added_book.bookName,
      category: added_book.category,
      description: added_book.description,
      coverImageURL: added_book.coverImageURL,
      price: added_book.price
    });
  } catch (error) {
    next(error);
  }
}

async function getAllBooks(req, res, next) {
  try {
    const sort = req.query.sort == "desc" ? -1 : 1;
    const pageSize = req.query.pageSize;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
        bookName: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
      : {}
    const count = await Book.countDocuments({ ...keyword });
    let follows;
    if (req.user) {
      follows = await Follow.find({ user: req.user._id });
    }
    const books = await
      Book.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
        .populate({
          path: 'category',
          select: 'categoryName'
        })
        .populate({
          path: 'author',
          select: 'fullName'
        }).exec();
    if (!books) {
      return next(createError(404));
    }
    if (req.user) {
      const result = books.map(book => {
        const followedCheck = follows.some(element => element._id.equals(book._id));
        return {
          ...book.toObject(),
          isFollowed: followedCheck
        }
      })
      return res.status(200).json({ result, page, pages: Math.ceil(count / pageSize) });
    }
    return res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

async function getBookById(req, res, next) {
  try {
    const bookId = req.params.bookId;
    let follow;
    if (req.user) {
      follow = await Follow.findOne({
        user: req.user._id,
        book: book._id
      });
    }
    const book = await Book.findById(bookId)
      .populate({
        path: 'author',
        select: '_id fullName email'
      })
      .populate('chapters')
      .populate({
        path: 'category',
        select: 'categoryName'
      }).exec();
    if (!book) {
      return next(createError(404));
    }
    book.avrStarNumber = Math.round(book.avrStarNumber * 100) / 100;

    if (eq.user) {
      return res.status(200).json({
        ...book.toObject(),
        isFollowed: !!follow,
      });
    }
    return res.status(200).json(book);
  } catch (error) {
    next(error);
  }
}

async function updateBook(req, res, next) {
  if (typeof req.body == 'undefined' || req.params.bookId === null) {
    return res.json({
      status: "Error",
      message: "Something went wrong! check your sent data"
    });
  }
  try {
    const { bookName, categoryId, description, coverImageURL, price } = req.body
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId)
      .populate({
        path: 'author',
        select: '-_id fullName'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      }).exec();
    if (!book) {
      return next(createError(404));
    }
    console.log(book);
    book.bookName = bookName;
    book.category = categoryId;
    book.description = description;
    book.coverImageURL = coverImageURL;
    book.price = price;

    await book.save();
    return res.json({ message: "Update book successed" });
  } catch (error) {
    next(error);
  }
}

async function deleteBook(req, res, next) {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId)
      .populate({
        path: 'author',
      }).exec();
    if (book) {
      console.log(book.author._id, req.user._id);
      if (book.author._id.equals(req.user._id)) {
        await book.remove();
        return res.status(200).json({ message: 'Deleted book' });
      }
      return res.status(403).json({ message: 'Unauthorize delete this book' });
    }
    return next(createError(404));
  }
  catch (error) {
    next(error);
  }
}

async function getBookByAuthor(req, res, next) {
  try {
    let follows;
    if (req.user) {
      follows = await Follow.find({ user: req.user._id })
    }
    const books = await Book.find({ author: req.user._id })
      .populate({
        path: 'author',
        select: '_id fullName email'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      }).exec();
    if (req.user) {
      const result = books.map(book => {
        return {
          ...book.toObject(),
          avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
          isFollowed: follows.some(element => element._id.equals(book._id))
        }
      });

      res.status(200).json(result);
    }

  } catch (error) {
    next(error);
  }
}

async function getBooksInCategory(req, res, next) {
  try {
    const categoryId = req.params.categoryId;
    const books = await Book.find({ category: categoryId })
      .populate({
        path: 'category',
        select: '_id categoryName'
      }).exec()
    let follows;
    if (req.user) {
      follows = await Follow.find({ user: req.user._id });
      const result = books.map(book => {
        return {
          ...book.toObject(),
          avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
          isFollowed: follows.some(element => element._id.equals(book._id))
        }
      });

      return res.status(200).json(result);
    }

    const result = books.map(book => {
      return {
        ...book.toObject(),
        avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
      }
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function searchBook(req, res, next) {
  try {
    const { bookId, authorId, category } = req.query;
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

    if (req.user) {
      const follows = await Follow.find({ user: req.user._id });
      const result = books.map(book => {
        return {
          ...book.toObject(),
          avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
          isFollowed: follows.some(element => element._id.equals(book._id))
        }
      });
      return res.status(200).json(result);
    }
    const result = books.map(book => {
      return {
        ...book.toObject(),
        avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getFollowedBooks(req, res, next) {
  try {
    const books = await Book.find().populate({
      path: 'follows',
      match: {
        user: req.user._id
      }
    }).exec()
    const result = books.map(book => {
      return {
        ...book.toObject(),
        avrStarNumber: Math.round(book.avrStarNumber * 100) / 100,
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBook,
  getBookById,
  updateBook,
  getBookByAuthor,
  searchBook,
  getAllBooks,
  getBooksInCategory,
  deleteBook,
  getFollowedBooks
}
