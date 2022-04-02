const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true
    },
    starNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
)

const Review = mongoose.model("Review", bookSchema);
module.exports = mongoose.model.Review || mongoose.model("Review", bookSchema);
