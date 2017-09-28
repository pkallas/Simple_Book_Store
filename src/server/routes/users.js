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
  .then((newUser) => {
    request.session.userId = newUser;
    request.session.role = 'reader';
    response.redirect('/');
  })
  .catch(error => {
    if (error.constraint === 'users_username_key') {
      response.render('users/signup', { errorMessage: 'Username is taken. Try again.' });
    } else if (error.constraint === 'users_email_key') {
      response.render('users/signup', { errorMessage: 'Email is taken. Try again.' });
    } else {
      // Replace with calling next with error
      console.error(error);
    }
  });
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
          request.session.userId = returnedUser.id;
          request.session.role = returnedUser.role;
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

router.get('/admin', (request, response) => {
  if (request.session.role === 'admin') {
    response.render('users/admin');
  } else {
    response.redirect('/');
  }
});

router.put('/admin/permissions', (request, response) => {
  if (request.session.role === 'admin') {
    const user = {
      login: request.body.login,
      role: request.body.role,
    };
    users.changeRole(user)
    .then(() => response.render('users/admin', { message: `User ${user.login} is now a ${user.role}` }))
    .catch(error => console.error(error));
  } else {
    response.redirect('/');
  }
});

router.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
});


module.exports = router;
