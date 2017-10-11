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

context('Books Database functions', function () {
  beforeEach(() => {
    return db.seedBooks()
    .then(() => db.seedAuthors())
    .then(() => db.seedGenres())
    .then(() => db.seedAuthorsBooks())
    .then(() => db.seedGenresBooks())
    .then(() => console.log('Test database seeded'));
  });

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
});
