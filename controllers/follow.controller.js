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

module.exports = {
  // unfollowBook,
  followBook,
}
