const { ObjectID } = require('typeorm');
const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');
const createError = require('http-errors');

async function createNewChapter(req, res, next) {
  try {
    const { bookId, title, contentLink, audioLink } = req.body;
    console.log(req.body);
    const book = await Book.findById(bookId).populate('chapters');
    if (!book) {
      return next(createError(404));
    }
    const chapterNumber = book.chapters.length + 1;
    const chapter = await Chapter.create({
      book,
      title,
      contentLink,
      audioLink,
      chapterNumber
    });
    res.status(201).json({
      _id: chapter._id,
      bookId: chapter.book,
      title: chapter.title,
      content: chapter.contentLink,
      audioLink: chapter.audioLink,
      chapterNumber: chapter.chapterNumber
    });
  } catch (error) {
    next(error);
  }
}

async function getDetailChapter(req, res, next) {
  try {
    const  bookId = req.query.bookId;
    const  chapterId = req.query.chapterId;
    const book = await Book.findById(bookId);
    if (book) {
      const chapter = await Chapter.findById(chapterId).populate('book');
      return res.status(200).json({
        chapterId: chapter._id,
        book: chapter.book,
        title: chapter.title,
        content: chapter.contentLink,
        audioLink: chapter.audioLink,
        chapterNumber: chapter.chapterNumber
      });     
    }

    return next(createError(404));
  } catch (error) {
    next(error);
  }
}

async function getAllChapter(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (book) {
      const chapters = await Chapter.find({
        book: ObjectID(bookId)
      }).populate('book').exec();
      return res.status(200).json(chapters);     
    }
    return next(createError(404));
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createNewChapter,
  getDetailChapter,
  getAllChapter
}
