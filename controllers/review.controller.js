const { Book } = require('../models/book.model');
const { Review } = require('../models/book.model');
const { ObjectID } = require('typeorm');
const constants = require('../utils/constants')

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


async function deleteReviewInBook(req, res, next) {
  const { reviewId, bookId } = req.params;
  if (typeof req.params.bookId === null || typeof req.params.reviewId === null) {
    return res.json({
      status: "Error",
      message: "Data is undefined"
    });
  }
  try {
    const book = await Book.findById(bookId)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
        }
      }).exec();
    if (book) {
      const findedReview = book.reviews.find(item => item._id == reviewId);
      if(!findedReview) {
        return next(createError(404));
      }
      if(findedReview.user._id.equals(req.user._id) || req.user.roles.includes(constants.ADMIN)) {
        console.log(findedReview);
        if (!findedReview) return res.status(403).json({ message: 'Unauthorized delete this review' });
        book.avrStarNumber = (book.avrStarNumber * book.reviewTotal - findedReview.starNumber) / (book.reviewTotal - 1);
        book.reviewTotal = book.reviewTotal - 1;
        book.reviews.pull(findedReview);
        await book.save();
        console.log(book);
        return res.status(200).json({ message: 'Deleted review' });
      }
      return res.status(403).json({message: "Unauthorized delete this review"});
    }
    return next(createError(404));
  }
  catch (error) {
    next(error);
  }
}

module.exports = {
  createReviewBook,
  getAllReviewsInBook,
  deleteReviewInBook
}
