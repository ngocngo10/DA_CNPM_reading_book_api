const { Review } = require('../models/book.model');
function validateCreateReview (req, res, next) {
  const { bookId, comment, starNumber } = req.body;
  const review = new Review({
    bookId,
    comment,
    starNumber,
    user: req.user._id
  });
  const error = review.validateSync();
  if (error) {
    const errors = {};
    
    for (const key in error.errors) {
      console.log(key);
      errors[key] = error.errors[key].message;
    }
    console.log(errors);
    res.status(400).json(errors);
  } else {
    next();
  }
}
module.exports = {
  validateCreateReview,
}
