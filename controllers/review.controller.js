const { Book } = require('../models/book.model');

async function createReviewBook(req, res, next) {
  try {
    const { bookId, comment, starNumber } = req.body;
    const existBook = await Book.findById(bookId).populate('reviews');

    if (!existBook) {
      return next(createError(404));
    }

    const user = req.user._id;
    const review = {
      user,
      comment,
      starNumber
    }

    existBook.reviews.push(review);
    existBook.avrStarNumber = (existBook.avrStarNumber * existBook.reviewTotal + review.starNumber) / (existBook.reviewTotal + 1);
    existBook.reviewTotal = existBook.reviewTotal + 1;
    await existBook.save(existBook);
    res.status(201).json({
      user: req.user.fullName,
      comment: review.comment,
      starNumber: review.starNumber,

    });
  } catch (error) {
    next(error);
  }
}

async function getAllReviewsInBook(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'email fullName avatar',
        }
      }).exec();
    if (book) {
      const reviews = book.reviews;
      return res.status(200).json(reviews);
    }
    return next(createError(404));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReviewBook,
  getAllReviewsInBook,
}