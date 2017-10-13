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

  describe('/books/create', function () {

    it('Should respond with 401 when not an admin', function () {
      return request(app)
      .get('/books/create')
      .then(response => {
        expect(response).to.have.status(401);
      })
      .catch(error => {
        expect(error.response).to.have.status(401);
      });
    });

    it('Should render the page when user is an admin', function () {
      let agent = chai.request.agent(app);
      agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        expect(response).to.have.cookie('cookie.sid');

        return agent.get('/books/create')
        .then(response => {
          expect(response).to.have.status(200);
        });
      });
    });
  });
});
