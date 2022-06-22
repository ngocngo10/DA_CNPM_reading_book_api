const { Book } = require('../models/book.model');
const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const createError = require('http-errors');
const { ObjectID } = require('typeorm');
const constants = require('../utils/constants')

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
    const typeSort = req.query.typeSort;
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
    let follows;
    if (req.user) {
      follows = await Follow.find({ user: req.user._id });
    }
    const sortItem = {};
    sortItem[typeSort] = sort;
    const books = await
      Book.find({ ...keyword, isAccept: true }).limit(pageSize).sort(sortItem).skip(pageSize * (page - 1))
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
    const count = await books.length;
    if (req.user) {
      const result = books.map(book => {
        const followedCheck = follows.some(element => element.book._id.equals(book._id));
        return {
          ...book.toObject(),
          isFollowed: followedCheck
        }
      })
      return res.status(200).json({ result, page, pages: Math.ceil(count / pageSize) });
    }
    return res.status(200).json({ books, page, pages: Math.ceil(count / pageSize) });
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
        book: bookId
      });
      if (req.user.roles.includes(constants.MOD)) {
        const book = await Book.findOne({ _id: bookId })
          .populate({
            path: 'author',
            select: '_id fullName email'
          })
          .populate({
            path: 'category',
            select: 'categoryName'
          }).exec();
        if (!book) {
          return next(createError(404));
        }
        book.avrStarNumber = Math.round(book.avrStarNumber * 100) / 100;

        return res.status(200).json({
          ...book.toObject(),
          isFollowed: !!follow,
        });
      }
    }
    const book = await Book.findOne({ _id: bookId, isAccept: true })
      .populate({
        path: 'author',
        select: '_id fullName email'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      }).exec();
    if (!book) {
      return next(createError(404));
    }
    book.avrStarNumber = Math.round(book.avrStarNumber * 100) / 100;
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
        select: '_id fullName'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      }).exec();
    if (!book) {
      return next(createError(404));
    }
    if(book.author.equals(req.user) || req.user.roles.includes(constants.MOD)) {
      book.bookName = bookName;
      book.category = categoryId;
      book.description = description;
      book.coverImageURL = coverImageURL;
      book.price = price;
      await book.save();
      return res.json({ message: "Update book successed" });
    }
    else {
      return res.status(403).json({ message: "Unthorized update book" });
    }

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
      if (book.author._id.equals(req.user._id) || req.user.roles.includes(constants.MOD)) {
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

async function updateViewNumberBook(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId)
    if (!book) {
      return next(createError(404));
    }
    book.viewNumber += 1;
    await book.save();

    return res.json({ message: "Updated book view number." });
  } catch (error) {
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
          isFollowed: follows.some(element => element.book._id.equals(book._id))
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
    const follows = await Follow.find({ user: req.user._id })
      .populate({
        path: 'book',
      });
    const books = follows.map(item => item.book);
    console.log(books);
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

async function updateBookStatus(req, res, next) {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(createError(404));
    }
    if (!book.author.equals(req.user._id)) {
      return next(createError(403));
    }

    book.status = req.body.status;
    await book.save();
    return res.status(200).json({ message: 'Book status has been updated.' });
  } catch (error) {
    next(error);
  }
}

async function acceptBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return next(createError(404));
    }
    book.isAccept = req.body.isAccept;
    book.acceptedBy = req.user._id;
    book.acceptedDate = new Date();
    await book.save();
    console.log(book)
    return res.status(200).json({ message: 'Book status has been accept' });
  } catch (error) {
    next(error);
  }
}

async function getAllAcceptedBook(req, res, next) {
  try {
    const sort = req.query.sort == "desc" ? -1 : 1;
    const typeSort = req.query.typeSort;
    const pageSize = req.query.pageSize;
    const page = Number(req.query.pageNumber) || 1;
    const sortItem = {};
    sortItem[typeSort] = sort;
    const books = await
      Book.find({ isAccept: true }).limit(pageSize).sort(sortItem).skip(pageSize * (page - 1))
        .populate({
          path: 'category',
          select: 'categoryName'
        })
        .populate({
          path: 'author',
          select: 'fullName'
        })
        .populate({
          path: 'acceptedBy',
          select: 'fullName avatar'
        });
    const count = await books.length;
    return res.status(200).json({ books, page, pages: Math.ceil(count / pageSize) });
  }
  catch (error) {
    next(error);
  }
}

async function getAllUnAcceptedBook(req, res, next) {
  try {
    const sort = req.query.sort == "desc" ? -1 : 1;
    const typeSort = req.query.typeSort;
    const pageSize = req.query.pageSize;
    const page = Number(req.query.pageNumber) || 1;
    const sortItem = {};
    sortItem[typeSort] = sort;

    const books = await
      Book.find({ isAccept: { $ne: true } }).limit(pageSize).sort(sortItem).skip(pageSize * (page - 1))
        .populate({
          path: 'category',
          select: 'categoryName'
        })
        .populate({
          path: 'author',
          select: 'fullName'
        })
        .populate({
          path: 'acceptedBy',
          select: 'fullName avatar'
        });
    const count = await books.length;
    return res.status(200).json({ books, page, pages: Math.ceil(count / pageSize) });
  }
  catch (error) {
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
  updateViewNumberBook,
  getFollowedBooks,
  updateBookStatus,
  acceptBook,
  getAllAcceptedBook,
  getAllUnAcceptedBook
}
