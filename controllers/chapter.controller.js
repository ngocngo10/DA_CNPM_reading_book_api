const { ObjectID } = require('typeorm');
const { Book } = require('../models/book.model');
const createError = require('http-errors');
const { getNewChapterUrl } = require('../utils/add_new_chapters');
const axios = require('axios');

async function createNewChapter(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const { title, content, audioLink } = req.body;
    const existBook = await Book.findById(bookId).populate('chapters');

    if (!existBook) {
      return next(createError(404));
    }

    const contentLink = await getNewChapterUrl(content);
    const chapterNumber = existBook.chapters.length + 1;
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
      contentLink: chapter.contentLink,
      audioLink: chapter.audioLink,
      chapterNumber: chapter.chapterNumber,
      fullTitle: `Chương ${chapter.chapterNumber}: ${chapter.title}`
    });
  } catch (error) {
    next(error);
  }
}

async function getDetailChapter(req, res, next) {
  try {
    const bookId = req.params.bookId;
    const chapterNumber = req.params.chapterNumber;
    const book = await Book.findById(bookId);
    if (book) {
      const chapter = book.chapters.find((item) => item.chapterNumber == chapterNumber);
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

async function updateChapter(req, res, next) {
  if (typeof req.body == 'undefined' || req.params.bookId === null) {
    return res.json({
      status: "Error",
      message: "Something went wrong! Check your sent data"
    });
  }
  try {
    const { title, content, audioLink } = req.body
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const book = await Book.findById(bookId)
      .populate({
        path: 'chapters'
      }).exec();
    if (!book) {
      return next(createError(404));
    }
    const chapter = book.chapters.find((item) => item._id == chapterId);
    const contentLink = await getNewChapterUrl(content);
    chapter.title = title;
    chapter.contentLink = contentLink;
    chapter.audioLink = audioLink;

    await book.save();
    return res.json({ message: "Update chapters successed" });
  } catch (error) {
    next(error);
  }
}

async function deleteChapterInBook(req, res, next) {
  const { bookId, chapterId } = req.params;
  try {
    const book = await Book.findOne({ _id: bookId, author: req.user })
      .populate({
        path: 'chapters'
      })
      .populate({
        path: 'author'
      }).exec();
    if (book) {
      const findedchapter = book.chapters.find(item => item._id == chapterId);
      if (!findedchapter) {
        return next(createError(404));
      }
      
      for (let chapter of book.chapters) {
        if(chapter.chapterNumber > findedchapter.chapterNumber)
        chapter.chapterNumber = chapter.chapterNumber -1 ;
      }
      book.chapters.pull(findedchapter);
      await book.save();
      return res.status(200).json({ message: 'Deleted chapter' });
    }
    return res.status(403).json({ message: "Unauthorize delete this chapter" });
  }
  catch (error) {
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
  getAllChapters,
  deleteChapterInBook,
  updateChapter
}
