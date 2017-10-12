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

    // it('Should update nothing when not given a book object', function () {
    //   return books.updateBook('Patrick')
    // });
  });

  describe('getAllGenres', function () {
    it('Should return all genres', function () {
      return books.getAllGenres()
      .then(allGenres => {
        expect(allGenres).to.eql([
          { "name": "alternate history" },
          { "name": "fiction" },
          { "name": "fantasy" },
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
        .then(() => books.getAllBooks)
        .then(allBooks => {
          expect(allBooks.length).to.eql(allBooksLength - 1);
        });
      });
    });
  });
});
