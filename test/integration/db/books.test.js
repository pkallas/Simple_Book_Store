const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const books = require('../../../src/models/db/books');

context('Books Database functions', function () {
  describe('getOne', function () {

    it('Should get all the information of one book', function () {
      return books.getOne(1)
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
      return expect(books.getOne('Patrick')).to.eventually.be.rejected;
    });

    it('Should get all the information of one book', function () {
      return books.getOne(2)
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

  describe('search', function () {

    it('Should return up to 10 matching books', function () {
      return books.search('harry', 0)
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

  describe('update', function () {

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
      return books.update(book)
      .then((updatedBook) => books.getOne(1))
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
      return books.getAll()
      .then(allBooks => {
        allBooksLength = allBooks.length;
        return books.deleteBook(1)
        .then(() => books.getAll())
        .then(newAllBooks => {
          expect(newAllBooks.length).to.eql(allBooksLength - 1);
        });
      });
    });

    it('Should throw an error if not given an integer', function () {
      return expect(books.deleteBook('NaN')).to.eventually.be.rejected;
    });
  });

  describe('create', function () {

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
      return books.getAll()
      .then(allBooks => {
        allBooksLength = allBooks.length;
        return books.create(book)
        .then(() => books.getAll())
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
      .then(() => books.getOne(1))
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
      .then(() => books.getOne(1))
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


    it('Should throw an error if not given a book id', function () {
      return expect(books.addOrEditAuthors('NaN', { key: 'Will Fail' })).to.eventually.be.rejected;
    });
  });

  describe('addOrEditGenres', function () {

    it('Should update all the genres of a given book', function () {
      let genres = ['fiction', 'fantasy'];
      return books.addOrEditGenres(1, genres)
      .then(() => books.getOne(1))
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
      .then(() => books.getOne(1))
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


    it('Should throw an error if not given a book id', function () {
      return expect(books.addOrEditGenres('NaN', ['Will Fail'])).to.eventually.be.rejected;
    });
  });
});
