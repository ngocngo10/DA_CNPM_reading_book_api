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

const reviewSchema = mongoose.Schema (
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: {
      type: String,
      required: [true, 'Comment field is required']
    },
    starNumber: {
      type: Number,
      require: true,
      min: [1, 'Star Number cannot less than 1'],
      max: [5, 'Star Number cannot more than 5']
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
  follows: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Follow',
  }],
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
  status: {
    type: String,
    enum : ['Ongoing', 'Completed', 'Paused'],
    default: 'Ongoing'
  },
  chapters: [chapterSchema],
  viewNumber: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: [reviewSchema],
  avrStarNumber: {
    type: Number,
    default: 0,
  },
  reviewTotal: {
    type: Number,
    default: 0,
  },
  followTotal: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  // acceptedby: {},
  // acceptedat: {},
  // updatedat: {},
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

const Book = mongoose.model.Book || mongoose.model("Book", bookSchema);
const Review = mongoose.model("Review", reviewSchema);
module.exports = {
  Book,
  Review,
}
