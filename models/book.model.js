const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookSchema = new Schema({
  bookName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  coverImageURL: {
    type: String,
    required: true
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  viewNumber: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Review',
  }],
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  // acceptedby: {},
  // acceptedat: {},
  // updatedat: {},
  bookFollowers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  acceptedDate: {
    type: Date
  },

}, {
  timestamps: true
});

const Book = mongoose.model("Book", bookSchema);
module.exports = mongoose.model.Book || mongoose.model("Book", bookSchema);
