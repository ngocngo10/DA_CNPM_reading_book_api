const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
  },
  message: {
    type: String
  },
  isSeen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = mongoose.model.Notification || Notification;
