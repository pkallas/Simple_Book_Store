const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');
const bookRoutes = require('./books');
const userRoutes = require('./users');
const middleware = require('../middleware');

router.get('/', (request, response, next) => {
  books.getAllImagesId()
  .then(books => response.render('books/index', { books }))
  .catch(error => next(error));
});

router.use(bookRoutes);
router.use(userRoutes);

router.use(middleware.errorHandler);
router.use(middleware.notFound);

module.exports = router;
