const Book = require('../models/book.model');
const Chapter = require('../models/chapter.model');

async function createNewChapter(req, res, next) {
  try {
    const { bookId, title, contentLink, audioLink } = req.body;
    console.log(req.body);
    const book = await Book.findById(bookId);
    const chapter = await Chapter.create({
      book,
      title,
      contentLink,
      audioLink
    });
    res.status(201).json({
      _id: chapter._id,
      bookId: chapter.book,
      title: chapter.title,
      content: chapter.contentLink,
      audioLink: chapter.audioLink
    });
  } catch (error) {
    next(error);
  }
}

async function detailChapter(req, res, next) {
  try {
    const  bookId = req.query.bookId;
    const  chapterId = req.query.chapterId;
    const book = await Book.findById(bookId);
    if (book) {
      const chapter = await Chapter.findById(chapterId).populate('book');
      res.status(200).json({
        chapterId: chapter._id,
        book: chapter.book,
        title: chapter.title,
        content: chapter.contentLink,
        audioLink: chapter.audioLink
      });     
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createNewChapter,
  detailChapter
}
