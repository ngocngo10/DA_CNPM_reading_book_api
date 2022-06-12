const {User} = require('../models/user.model');
const Follow = require('../models/follow.model');
const Notification = require('../models/notification.model');
const { Book } = require('../models/book.model');
require('dotenv').config();

async function createNotification(bookId, chapter) {
  try {
    const followers = await Follow.find({ book: bookId })
      .populate({
        path: 'book',
      }).exec();
    const book = await Book.findById(bookId);
    const message = `${book.bookName} has a new chapter: ${chapter.chapterNumber} - ${chapter.title}.`
    const notifcations = followers.map(item => {
      return {
        book: item.book,
        user: item.user,
        message,
      }
    });
    await Notification.create(notifcations);
  } catch (error) {
    console.log(error);
    throw error;
  }
}


module.exports = {
  // readAllNotifications,
  createNotification,
  // readNotification,
  // getNotifications,
}
