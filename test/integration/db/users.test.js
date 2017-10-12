const db = require('../../helpers/db');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const users = require('../../../src/models/db/users');

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
  return db.truncateUsers()
  .then(() => console.log('Users table from simple_book_store_test has been truncated'));
});

beforeEach(() => {
  return db.truncateCarts()
  .then(() => console.log('Carts table from simple_book_store_test has been truncated'));
});

beforeEach(() => {
  return db.seedBooks()
  .then(() => db.seedAuthors())
  .then(() => db.seedGenres())
  .then(() => db.seedAuthorsBooks())
  .then(() => db.seedGenresBooks())
  .then(() => db.seedUsers())
  .then(() => db.seedUsers())
  .then(() => db.seedCarts('badpassword', { username: 'bob', email: 'bob@bob.com', }))
  .then(() => db.seedCarts('worsepassword', { username: 'jim', email: 'jim@jim.com', }))
  .then(() => console.log('Test database seeded'));
});
