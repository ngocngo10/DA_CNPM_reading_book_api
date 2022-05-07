const { ObjectID } = require('typeorm');
const Book = require('../models/book.model');
// const Chapter = require('../models/chapter.model');
const createError = require('http-errors');

async function createNewChapter(req, res, next) {
  try {
    const bookId = req.query.bookId;
    const { contentLink, audioLink } = req.body;
    const existBook = await Book.findById(bookId).populate('chapters');
    if (!existBook) {
      return next(createError(404));
    }
    const chapterNumber = existBook.chapters.length + 1;
    const title = "Chương " + chapterNumber;
    const chapter = {
      title,
      contentLink,
      audioLink,
      chapterNumber
    };
    existBook.chapters.push(chapter);
    existBook.save(existBook);
    console.log("existBook" + existBook);
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
    const bookId = req.query.bookId;
    const chapterNumber = req.query.chapterNumber;
    const book = await Book.findById(bookId);
    if (book) {
      const chapter = book.chapters.find((chapterNumber) => chapterNumber == chapterNumber);
      // const chapter = await Book.findById(chapterId).populate('book');
      return res.status(200).json({
        chapterId: chapter._id,
        book: book.title,
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

async function getAllChapters(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (book) {
      const chapters = book.chapters;
      // const chapters = await Book.find({
      //   book: ObjectID(bookId)
      // }).populate('book').exec();
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
  getAllChapters
}
