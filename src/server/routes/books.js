const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');

router.get('/books/:id', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => console.error(error));
});

router.get('/books/search', (request, response) => {
  const searchTerm = request.body.query
    .replace(/^ */, '%')
    .replace(/ *$/, '%')
    .replace(/ +/g, '%');
  if (request.query.start) {
    let offset = request.query.start;
  } else {
    let offset = 0;
  }

  searchForBooks(searchTerm)
    .then(books => {
      response.render('search', { books });
    })
    .catch(err => console.log(err));
});

module.exports = router;
