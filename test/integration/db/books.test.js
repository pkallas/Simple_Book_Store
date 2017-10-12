const db = require('../../helpers/db');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const books = require('../../../src/models/db/books');

beforeEach(() => {
  return db.truncateBooks()
  .then(() => console.log('Books table from simple_book_store_test has been truncated'));
});

beforeEach(() => {
  return db.truncateAuthors()
  .then(() => console.log('Authors table from simple_book_store_test has been truncated'));
});

beforeEach(() => {
  return db.truncateGenres()
  .then(() => console.log('Genres table from simple_book_store_test has been truncated'));
});

beforeEach(() => {
  return db.seedBooks()
  .then(() => db.seedAuthors())
  .then(() => db.seedGenres())
  .then(() => db.seedAuthorsBooks())
  .then(() => db.seedGenresBooks())
  .then(() => console.log('Test database seeded'));
});

context('Books Database functions', function () {
  describe('getOneBook', function () {

    it('Should get all the information of one book', function () {
      return books.getOneBook(1)
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          in_stock: 5,
          isbn: '8487582',
          publisher: 'Del Rey',
          authors: [{ id: 1, first_name: 'Harry', last_name: 'Turtledove' }],
          genres: ['alternate history', 'fiction'],
        });
      });
    });

    it('Should throw an error if not given an integer', function () {
      return expect(books.getOneBook('Patrick')).to.eventually.be.rejected;
    });

    it('Should get all the information of one book', function () {
      return books.getOneBook(2)
      .then(book => {
        expect(book).to.eql({
          id: 2,
          title: 'Harry Potter',
          price: '7.99',
          img_url: 'Harry Potter Image',
          in_stock: 3,
          isbn: '83758274',
          publisher: 'Scholastic',
          authors: [{ id: 2, first_name: 'J. K.', last_name: 'Rowling' }],
          genres: ['fantasy', 'fiction'],
        });
      });
    });
  });

  describe('searchForBooks', function () {

    it('Should return up to 10 matching books', function () {
      return books.searchForBooks('harry', 0)
      .then(foundBooks => {
        expect(foundBooks).to.eql([{
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          first_name: 'Harry',
          last_name: 'Turtledove', },
        ]);
      });
    });
  });

  describe('updateBook', function () {

    it('Should update a book with the given id', function () {
      let book = {
        id: 1,
        title: 'Updated Title',
        image: 'Updated Image',
        price: '3.23',
        inStock: 0,
        isbn: 'Updated isbn',
        publisher: 'Updated publisher',
      };
      return books.updateBook(book)
      .then((updatedBook) => books.getOneBook(1))
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'Updated Title',
          price: '3.23',
          img_url: 'Updated Image',
          in_stock: 0,
          isbn: 'Updated isbn',
          publisher: 'Updated publisher',
          authors: [{ id: 1, first_name: 'Harry', last_name: 'Turtledove' }],
          genres: ['alternate history', 'fiction'],
        });
      });
    });
  });

  describe('getAllGenres', function () {

    it('Should return all genres', function () {
      return books.getAllGenres()
      .then(allGenres => {
        expect(allGenres).to.eql([
          { 'name': 'alternate history' },
          { 'name': 'fiction' },
          { 'name': 'fantasy' },
        ]);
      });
    });
  });

  describe('deleteBook', function () {

    it('Should delete the book with the given id', function () {
      let allBooksLength = 0;
      return books.getAllBooks()
      .then(allBooks => {
        allBooksLength = allBooks.length;
        return books.deleteBook(1)
        .then(() => books.getAllBooks())
        .then(newAllBooks => {
          expect(newAllBooks.length).to.eql(allBooksLength - 1);
        });
      });
    });
  });

  describe('createBook', function () {

    it('Should add a new book to the database', function () {
      let allBooksLength = 0;
      let book = {
        title: 'New Book',
        price: 9.87,
        image: 'New Book Image',
        isbn: '767665',
        inStock: 5,
        publisher: 'New Publisher',
      };
      return books.getAllBooks()
      .then(allBooks => {
        allBooksLength = allBooks.length;
        return books.createBook(book)
        .then(() => books.getAllBooks())
        .then(newAllBooks => {
          expect(newAllBooks.length).to.eql(allBooksLength + 1);
        });
      });
    });
  });

  describe('addOrEditAuthors', function () {

    it('Should update the author of a given book', function () {
      let authors = [{ firstName: 'Patrick', lastName: 'Kallas', }];
      return books.addOrEditAuthors(1, authors)
      .then(() => books.getOneBook(1))
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          in_stock: 5,
          isbn: '8487582',
          publisher: 'Del Rey',
          authors: [{ id: 4, first_name: 'Patrick', last_name: 'Kallas' }],
          genres: ['alternate history', 'fiction'],
        });
      });
    });

    it('Should assign multiple authors to one book', function () {
      let authors = [
        { firstName: 'Author1', lastName: 'Author2', },
        { firstName: 'Author2', lastName: 'Author2', },
        { firstName: 'Author3', lastName: 'Author3', }];
      return books.addOrEditAuthors(1, authors)
      .then(() => books.getOneBook(1))
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          in_stock: 5,
          isbn: '8487582',
          publisher: 'Del Rey',
          authors: [{ id: 4, first_name: 'Author1', last_name: 'Author2' },
          { id: 5, first_name: 'Author2', last_name: 'Author2' },
          { id: 6, first_name: 'Author3', last_name: 'Author3' }],
          genres: ['alternate history', 'fiction'],
        });
      });
    });
  });

  describe('addOrEditGenres', function () {

    it('Should update all the genres of a given book', function () {
      let genres = ['fiction', 'fantasy'];
      return books.addOrEditGenres(1, genres)
      .then(() => books.getOneBook(1))
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          in_stock: 5,
          isbn: '8487582',
          publisher: 'Del Rey',
          authors: [{ id: 1, first_name: 'Harry', last_name: 'Turtledove' }],
          genres: ['fantasy', 'fiction'],
        });
      });
    });

    it('Should allow a user to add new genres to the database', function () {
      let genres = ['fiction', 'fantasy', 'some new genre', 'another new genre'];
      return books.addOrEditGenres(1, genres)
      .then(() => books.getOneBook(1))
      .then(book => {
        expect(book).to.eql({
          id: 1,
          title: 'How Few Remain',
          price: '4.54',
          img_url: 'How Few Remain Image',
          in_stock: 5,
          isbn: '8487582',
          publisher: 'Del Rey',
          authors: [{ id: 1, first_name: 'Harry', last_name: 'Turtledove' }],
          genres: ['another new genre', 'fantasy', 'fiction', 'some new genre'],
        });
      });
    });
  });
});
