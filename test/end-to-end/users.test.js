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

  describe('/login', function () {

    it('Should render the login page', function () {
      return request(app)
      .get('/login')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });

    it('Should redirect to home after a user logs in', function () {
      return request(app)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        expect(response.redirects[0]).to.match(/\//);
      });
    });

    it('Should rerender the page if the username or password is not correct', function () {
      return request(app)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: '123', })
      .then(response => {
        expect(response.res.text).to.include('Incorrect username or password');
      });
    });

    it('Should rerender the page if the username or password is not correct', function () {
      return request(app)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob1',
              password: 'badpassword', })
      .then(response => {
        expect(response.res.text).to.include('Incorrect username or password');
      });
    });
  });

  describe('/admin', function () {

    it('Should have a response of 401 if the user is not an admin', function () {
      return request(app)
      .get('/admin')
      .then(response => {
        expect(response).to.have.status(401);
      })
      .catch(error => {
        expect(error.response).to.have.status(401);
      });
    });

    it('Should render the page if the user is an admin', function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.get('/admin')
        .then(response => {
          expect(response).to.have.status(200);
        });
      });
    });
  });

  describe('/admin/permissions', function () {

    it('Should have a status of 401 if the user is not an admin', function () {
      return request(app)
      .put('/admin/permissions')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'jim',
              role: 'clerk', })
      .then(response => {
        expect(response).to.have.status(401);
      })
      .catch(error => {
        expect(error.response).to.have.status(401);
      });
    });

    it('Should rerender the page with a success message if the user is an admin', function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.put('/admin/permissions')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ login: 'jim',
                role: 'clerk', })
        .then(response => {
          expect(response.res.text).to.include('User jim is now a clerk');
        });
      });
    });

    it('Should rerender the page with an error message if the user being changed does not exist', function () {
      let agent = chai.request.agent(app);
      return agent.post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ login: 'bob',
              password: 'badpassword', })
      .then(response => {
        return agent.put('/admin/permissions')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ login: 'roger',
                role: 'clerk', })
        .then(response => {
          expect(response.res.text).to.include('User roger not found');
        });
      });
    });
  });
});
