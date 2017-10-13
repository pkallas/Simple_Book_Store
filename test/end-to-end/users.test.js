process.env.DATABASE_URL = 'postgres://localhost:5432/simple_book_store_test';
const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/server');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;

context('users routes', function () {
  describe('/signup', function () {

    it('Should render the signup page', function () {
      return request(app)
      .get('/signup')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });

    it('Should redirect to the home page after a user signs up', function () {
      return request(app)
      .post('/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ username: 'New User',
              email: 'user@user.com',
              password: '123',
              confirmPassword: '123', })
      .then(response => {
        expect(response.redirects[0]).to.match(/\//);
      });
    });

    it('Should rerender the page if a username is already taken', function () {
      return request(app)
      .post('/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ username: 'bob',
              email: 'user@user.com',
              password: '123',
              confirmPassword: '123', })
      .then(response => {
        expect(response.res.text).to.include('Username is taken. Try again.');
      });
    });

    it('Should rerender the page if an email is already taken', function () {
      return request(app)
      .post('/signup')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ username: 'user',
              email: 'bob@bob.com',
              password: '123',
              confirmPassword: '123', })
      .then(response => {
        expect(response.res.text).to.include('Email is taken. Try again.');
      });
    });
  });
});
