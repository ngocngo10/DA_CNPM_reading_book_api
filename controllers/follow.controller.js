const { Book } = require('../models/book.model');
const { ObjectId } = require('mongoose');
const Follow = require('../models/follow.model');
require('dotenv').config();

async function followBook(req, res, next) {
  try {
    const { bookId } = req.body;
    const followedCheck = await Follow.findOne({ user: req.user._id, book: bookId});
    if (followedCheck) {
      return res.status(400).json({ message: 'Book was followed.' })
    }
    console.log(bookId)
    const book = await Book.findById(bookId).populate('follows');
    if (!book) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const follow = await Follow.create({
      user: req.user._id,
      book: book._id,
    });

    book.followTotal++;
    book.follows.push(follow);
    await book.save();
    res.status(201).json({ message: 'followed' })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function unfollowBook(req, res, next) {
  try {
    const { bookId } = req.params;
    const follow = await Follow.findOne({
      user: req.user._id,
      book: bookId,
    });
    if (!follow) {
      return res.status(400).json({ message: 'book is not followed.'})
    }
    const book = await Book.findById(bookId);
    await book.follows.pull(follow._id);
    await follow.remove();
    book.followTotal = book.followTotal - 1;
    await book.save();
    res.status(200).json({ message: 'unfollowed' })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  unfollowBook,
  followBook,
}
