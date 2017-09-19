const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');

router.get('/books/search', (request, response) => {
  let offset;
  let searchTerm = request.query.search
    .toLowerCase()
    .replace(/^ */, '%')
    .replace(/ *$/, '%')
    .replace(/ +/g, '%');
  if (request.query.start) {
    offset = request.query.start;
  } else {
    offset = 0;
    // request.query.start = 0;
  }

  books.searchForBooks(searchTerm, offset)
    .then(books => {
      response.render('books/search', { books, offset, searchTerm: request.query.search });
    })
    .catch(err => console.log(err));
});

router.get('/books/:id', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => console.error(error));
});

module.exports = router;
