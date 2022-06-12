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

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find()
      .populate({
        path: 'user',
        select: 'fullName',
        // match: {
        //   _id: req.user._id
        // }
      })
      .populate({
        path: 'book',
        select: 'bookName'
      }).exec();
    return res.json(notifications);
  } catch (error) {
    next(error);
  }
}

async function readAllNotifications(req, res, next) {
  try {
    await Notification.update({ user: req.user._id }, { "$set": { "isSeen": true } });
    return res.status(200).json({
      message: "You have seen all notifications."
    });
  } catch (error) {
    next(error);
  }
}

// async function readNotification(req, res, next) {
//   try {
//     const notification = await Notification.findById(req.body.notificationId);
//     notification.isSeen = true;
//     await notification.save()
//     return res.status(200).json({
//       message: "You have seen this notification."
//     });
//   } catch (error) {
//     next(error);
//   }
// }

module.exports = {
  readAllNotifications,
  createNotification,
  // readNotification,
  getNotifications,
}
