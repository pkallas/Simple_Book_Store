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
  const oldFirstName = request.body.oldFirstName;
  const oldLastName = request.body.oldLastName;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const oldGenre = request.body.oldGenre;
  const bookId = request.params.id;
  books.updateBook(bookId, title, imgUrl, price, inStock, isbn, publisher)
  .then(() => books.updateBookAuthor(firstName, lastName, bookId, oldFirstName, oldLastName))
  .catch(error => console.error(error));
  let i = 0;
  while (request.body['genre' + i]) {

    i++;
  }
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

module.exports = router;
