const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
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
}, {
  timestamps: true
});

const Follow = mongoose.model("Follow", followSchema);
module.exports = mongoose.model.Follow || Follow;
