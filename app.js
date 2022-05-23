const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require("morgan");
const createError = require('http-errors');
require('dotenv').config();

const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const bookRouter = require('./routes/book.route');
const uploadImageRouter = require('./routes/upload_image.route');
const chapterRouter = require('./routes/chapter.route');
const categoryRouter = require('./routes/category.route');
const reviewRouter = require('./routes/review.route');

const users = require('./routes/users');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(cors())

mongoose.connect(process.env.MONGO_URI, (error) => {
  if (error) {
    console.log(error)
  }
  else {
    console.log("Connected to db!");
  }
});

app.get('/', function(req, res) {
  res.render(__dirname + '/views/books/added_book_form.ejs');
});
app.get('/add_chapter', function(req, res) {
  res.render(__dirname + '/views/books/add_chapter_string.ejs');
});
app.get('/create_chapter', function(req, res) {
  res.render(__dirname + '/views/books/added_chapter_form.ejs');
});
// app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api', uploadImageRouter);
app.use('/api/chapters', chapterRouter);
app.use('/api/v1/users', users);
app.use('/api/categories', categoryRouter);
app.use('/api/reviews', reviewRouter);

app.get('/', function (req, res) {
  res.send('ok');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
