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
    .catch(error => console.log(error));
});

router.get('/books/create', (request, response) => {
  response.render('books/create');
});

router.post('/books/create', (request, response) => {
  const compiledBook = {
    title: request.body.title,
    price: request.body.price,
    image: request.body.image,
    inStock: request.body.inStock,
    isbn: request.body.isbn,
    publisher: request.body.publisher,
  };
  console.log('compiled Book ===> ', compiledBook);
  const authors = [];
  const genres = [];
  let i = 0;
  while (request.body['firstName' + i]) {
    let author = {};
    author.firstName = request.body['firstName' + i];
    author.lastName = request.body['lastName' + i];
    authors.push(author);
    i++;
  };
  let j = 0;
  while (request.body['genre' + j]) {
    genres.push(request.body['genre' + j]);
    j++;
  };
  console.log('authors ===> ', authors);
  console.log('genres ===> ', genres);
  books.createBook(compiledBook)
    .then(book => {
      books.addOrEditAuthors(book[0].id, authors)
      .then(() => books.addOrEditGenres(book[0].id, genres))
      .then(() => response.render(`books/:${book[0].id}`));
    })
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

router.put('/books/:id/edit', (request, response) => {
  const compiledBook = {
    title: request.body.title,
    image: request.body.image,
    price: request.body.price,
    inStock: request.body.inStock,
    isbn: request.body.isbn,
    publisher: request.body.publisher,
    id: request.params.id,
  };
  const authors = [];
  const genres = [];
  let i = 0;
  while (request.body['firstName' + i]) {
    let author = {};
    author.firstName = request.body['firstName' + i];
    author.lastName = request.body['lastName' + i];
    authors.push(author);
    i++;
  };
  let j = 0;
  while (request.body['genre' + j]) {
    genres.push(request.body['genre' + j]);
    j++;
  };
  books.updateBook(compiledBook)
  .then(() => books.addOrEditAuthors(compiledBook.id, authors))
  .then(() => books.addOrEditGenres(compiledBook.id, genres))
  .then(() => response.redirect(`/books/${compiledBook.id}`))
  .catch(error => console.error(error));
});

router.get('/books/:id', (request, response) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => console.error(error));
});

router.delete('/books/:id/', (request, response) => {
  const id = request.params.id;
  books.deleteBook(id)
  .then(() => response.redirect('/'))
  .catch(error => console.error(error));
});

module.exports = router;
