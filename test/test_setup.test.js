const db = require('./helpers/db');

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
  .then(() => db.seedUsers('badpassword', { username: 'bob', email: 'bob@bob.com', }))
  .then(() => db.seedUsers('worsepassword', { username: 'jim', email: 'jim@jim.com', }))
  .then(() => db.seedCarts(1, 1))
  .then(() => db.seedCarts(2, 2))
  .then(() => db.makeAdmin())
  .then(() => console.log('Test database seeded'));
});
