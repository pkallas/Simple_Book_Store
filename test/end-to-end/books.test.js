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
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.get('/books/create')
        .then(response => {
          expect(response).to.have.status(200);
        });
      });
    });

    it('Should respond with a 401 when a user that is not an admin tries to create a book', function () {
      return request(app)
      .post('/books/create')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ title: 'New Book',
              price: 3.43,
              image: 'http://NewImage.jpg',
              inStock: 30,
              isbn: 'New ISBN',
              publisher: 'New Publisher',
              firstName0: 'First Author',
              lastName0: 'First Author',
              firstName1: 'Second Author',
              lastName1: 'Second Author',
              genre0: 'First genre',
              genre1: 'Second genre', })
      .then(response => {
        expect(response).to.have.status(401);
      })
      .catch(error => {
        expect(error.response).to.have.status(401);
      });
    });

    it('Should redirect to the newly created book page if user is an admin', function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.post('/books/create')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ title: 'New Book',
                price: 3.43,
                image: 'http://NewImage.jpg',
                inStock: 30,
                isbn: 'New ISBN',
                publisher: 'New Publisher',
                firstName0: 'First Author',
                lastName0: 'First Author',
                firstName1: 'Second Author',
                lastName1: 'Second Author',
                genre0: 'First genre',
                genre1: 'Second genre', })
        .then(response => {
          expect(response.redirects[0]).to.match(/\/books\/4/);
        });
      });
    });

    it('Should render the create page with a message if the image url does not start with http or end with .jpg or .png', function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.post('/books/create')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ title: 'New Book',
                price: 3.43,
                image: 'NewImage',
                inStock: 30,
                isbn: 'New ISBN',
                publisher: 'New Publisher',
                firstName0: 'First Author',
                lastName0: 'First Author',
                firstName1: 'Second Author',
                lastName1: 'Second Author',
                genre0: 'First genre',
                genre1: 'Second genre', })
        .then(response => {
          expect(response.res.text).to.include('Please input a valid image');
        });
      });
    });
  });

  describe('/books/:bookid', function () {

    it('Should render a page with a single books information', function () {
      return request(app)
      .get('/books/1')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });

    it('Should have a status of 401 if a user tries to delete a book and is not an admin', function () {
      return request(app)
      .delete('/books/1')
      .then(response => {
        expect(response).to.have.status(401);
      })
      .catch(error => {
        expect(error.response).to.have.status(401);
      });
    });

    it(`Should respond with 'Book with id 1 was deleted' if the user is an admin`, function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.delete('/books/1')
        .then(response => {
          expect(response.res.text).to.include('Book with id 1 was deleted');
        });
      });
    });
  });
});
