const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
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
    },
  },
  {
    timestamps: true,
  }
)

const Chapter = mongoose.model("Chapter", chapterSchema);
module.exports = mongoose.model.Chapter || mongoose.model("Chapter", chapterSchema);
