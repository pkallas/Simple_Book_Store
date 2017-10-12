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
  .then(() => db.seedUsers('badpassword', { username: 'bob', email: 'bob@bob.com', }))
  .then(() => db.seedUsers('worsepassword', { username: 'jim', email: 'jim@jim.com', }))
  .then(() => db.seedCarts(1, 1))
  .then(() => db.seedCarts(2, 2))
  .then(() => console.log('Test database seeded'));
});

context('Users database functions', function () {
  describe('create', function () {

    it('Should add a new user to the database', function () {
      let newUser = {
        username: 'pkallas',
        email: 'pkallas@pkallas.com',
        password: '123',
      };
      return users.create(newUser)
      .then(newUserId => {
        expect(newUserId).to.eql(3);
      });
    });

    it('Should throw an error if the username is already taken', function () {
      let newUser = {
        username: 'bob',
        email: 'bob2@bob.com',
        password: '123',
      };
      return expect(users.create(newUser)).to.eventually.be.rejected;
    });

    it('Should throw an error if the email is already taken', function () {
      let newUser = {
        username: 'bob2',
        email: 'bob@bob.com',
        password: '123',
      };
      return expect(users.create(newUser)).to.eventually.be.rejected;
    });
  });

  describe('changeRole', function () {

    it('Should change the role of a user when given a username', function () {
      let userToBeChanged = {
        login: 'bob',
        role: 'clerk',
      };
      return users.changeRole(userToBeChanged)
      .then(newUserId => users.getByLogin(userToBeChanged))
      .then(returnedUser => {
        expect(returnedUser.role).to.eql('clerk');
      });
    });

    it('Should change the role of a user when given an email', function () {
      let userToBeChanged = {
        login: 'jim@jim.com',
        role: 'admin',
      };
      return users.changeRole(userToBeChanged)
      .then(newUserId => users.getByLogin(userToBeChanged))
      .then(returnedUser => {
        expect(returnedUser.role).to.eql('admin');
      });
    });
  });
});
