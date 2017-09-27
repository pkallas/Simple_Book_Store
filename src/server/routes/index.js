const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');
const bookRoutes = require('./books');
const userRoutes = require('./users');

router.get('/', (request, response) => {
  books.getAllBookImagesId()
  .then(books => response.render('books/index', { books }))
  .catch(error => console.error(error));
});

router.use(bookRoutes);
router.use(userRoutes);

module.exports = router;
