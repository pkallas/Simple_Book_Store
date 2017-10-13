process.env.DATABASE_URL = 'postgres://localhost:5432/simple_book_store_test';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../../src/server');
chai.use(chaiHttp);
const request = chai.request;

context('Book routes', function () {
  describe('/', function () {

    it('Should render the home page', function () {
      return request(app)
      .get('/')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });
  });

  describe('/books/search', function () {

    it('Should render the search page when given a search term', function () {
      return request(app)
      .get("/books/search?search='harry'")
      .then(response => {
        expect(response).to.have.status(200);
      });
    });
  });
});
