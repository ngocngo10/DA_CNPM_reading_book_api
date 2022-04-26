const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contentLink: {
      type: String,
      required: true
    },
    audioLink: {
      type: String
    },
    chapterNumber: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
)

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
  category:  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  description: {
    type: String
  },
  coverImageURL: {
    type: String,
    required: true
  },
  chapters: [chapterSchema],
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
