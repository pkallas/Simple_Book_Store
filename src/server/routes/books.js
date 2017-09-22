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
  }

  books.searchForBooks(searchTerm, offset)
    .then(books => {
      response.render('books/search', { books, offset, searchTerm: request.query.search });
    })
    .catch(err => console.log(err));
});

router.put('/books/:id/edit', (request, response) => {
  const title = request.body.title;
  const imgUrl = request.body.imgUrl;
  const price = request.body.price;
  const inStock = request.body.inStock;
  const isbn = request.body.isbn;
  const publisher = request.body.publisher;
  const bookId = request.params.id;
  const authors = [];
  const genres = [];
  let i = 0;
  while (request.body['firstName' + i]) {
    let author = {};
    author.firstName = request.body['firstName' + i]
    author.lastName = request.body['lastName' + i]
    authors.push(author)
    i++
  };
  let j = 0;
  while (request.body['genre' + j]) {
    genres.push(request.body['genre' + j]);
    j++
  };
  books.updateBook(bookId, title, imgUrl, price, inStock, isbn, publisher)
  .then(() => books.addOrEditAuthors(bookId, authors))
  .then(() => books.addOrEditGenres(bookId, genres))
  .then(() => response.redirect(`/books/${bookId}`))
  .catch(error => console.error(error));
});

router.get('/books/:id/edit', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => {
    books.getAllGenres().then(allGenres => response.render('books/edit', { book, allGenres }));
  })
  .catch(error => console.error(error));
});

router.get('/books/:id', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => console.error(error));
});

router.get('/books/create', (request, response) => {
  response.render('books/create');
});

router.delete('/books/:id/delete', (request, response) => {
  const id = request.params.id;
  books.deleteBook(id)
  .then(() => response.redirect('/'))
  .catch(error => console.error(error));
});

module.exports = router;
