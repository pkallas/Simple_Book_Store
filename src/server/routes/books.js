const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');

router.get('/books/:id', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => console.error(error));
});

module.exports = router;
