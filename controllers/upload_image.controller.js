// @desc    upload_book
// @route   POST /api/upload_image
// @access   user
async function upLoadImage(req, res, next) {
  try {
    const { bookName, authorId, category, coverImage, price } = req.body;
    const author = await User.findById(authorId);

    const book = await Book.create({
      bookName,
      author,
      category,
      coverImage,
      price,
    });
    res.status(201).json({
      _id: book._id,
      bookName: book.bookName,
      author: book.author,
      category: book.category,
      coverImage: book.coverImage,
      price: book.price
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBook
}
