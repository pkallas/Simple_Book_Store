const express = require('express');
const router = express.Router();
const users = require('../../models/db/users');

router.get('/signup', (request, response) => {
  response.render('users/signup');
});

router.post('/signup', (request, response) => {
  if (request.body.password !== request.body.confirmPassword) {
    response.render('users/signup', { errorMessage: 'Please make sure your passwords match' });
  }

  const user = {
    username: request.body.username,
    email: request.body.email,
    password: request.body.password,
  };
  users.create(user)
  .then(() => response.redirect('/'))
  .catch(error => console.error(error));
});

router.get('/login', (request, response) => {
  response.render('users/login');
});

router.post('/login', (request, response) => {
  const user = {
    login: request.body.login,
    password: request.body.password,
  };
  const errorMessage = 'Incorrect username or password';
  users.getByLogin(user)
  .then(returnedUser => {
    if (returnedUser) {
      users.isValidPassword(user.password, returnedUser.password)
      .then(isValid => {
        if (isValid) {
          // set session by user id and role
          response.redirect('/');
        } else {
          response.render('users/login', { errorMessage });
        }
      });
    } else {
      response.render('users/login', { errorMessage });
    }
  })
  .catch(error => console.error(error));
});

module.exports = router;
