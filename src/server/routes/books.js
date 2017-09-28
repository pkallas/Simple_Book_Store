const express = require('express');
const router = express.Router();
const books = require('../../models/db/books');

router.get('/books/search', (request, response, next) => {
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
    .catch(error => next(error));
});

router.get('/books/create', (request, response) => {
  if (request.session.role === 'admin') {
    response.render('books/create');
  } else {
    response.status(401).render('common/not_permitted');
  }
});

router.post('/books/create', (request, response, error) => {
  if (request.session.role === 'admin') {
    const compiledBook = {
      title: request.body.title,
      price: request.body.price,
      image: request.body.image,
      inStock: request.body.inStock,
      isbn: request.body.isbn,
      publisher: request.body.publisher,
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
    books.createBook(compiledBook)
      .then(book => {
        books.addOrEditAuthors(book[0].id, authors)
        .then(() => books.addOrEditGenres(book[0].id, genres))
        .then(() => response.redirect(`/books/${book[0].id}`));
      })
      .catch(error => next(error));
  } else {
    response.status(401).send('Unauthorized user');
  }
});

router.get('/books/:id/edit', (request, response, error) => {
  if (request.session.role === 'clerk' || request.session.role === 'admin') {
    const id = request.params.id;
    books.getOneBook(id)
    .then(book => {
      return books.getAllGenres().then(allGenres => response.render('books/edit', { book, allGenres }));
    })
    .catch(error => next(error));
  } else {
    response.status(401).render('common/not_permitted');
  }
});

router.put('/books/:id/edit', (request, response, next) => {
  if (request.session.role === 'clerk' || request.session.role === 'admin') {
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
    .catch(error => next(error));
  } else {
    response.status(401).send('Unauthorized user');
  }
});

router.get('/books/:id', (request, response, next) => {
  const id = request.params.id;
  books.getOneBook(id)
  .then(book => response.render('books/book', { book }))
  .catch(error => next(error));
});

router.delete('/books/:id/', (request, response, next) => {
  if (request.session.role === 'admin') {
    const id = request.params.id;
    books.deleteBook(id)
    .then(() => response.send(`Book with id ${id} was deleted`))
    .catch(error => response.send(`Error deleting book with id ${id}`));
  } else {
    response.status(401).send('Unauthorized User');
  }
});

module.exports = router;
