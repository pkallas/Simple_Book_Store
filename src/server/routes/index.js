const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');
const bookRoutes = require('./books');

router.get('/', (request, response) => {
  books.getAllBookImages()
  .then(books => response.render('books/index', { books }))
  .catch(error => console.error(error));
});

router.use(bookRoutes);

module.exports = router;
