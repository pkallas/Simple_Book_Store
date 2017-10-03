const express = require('express');
const router = express.Router();
const users = require('../../models/db/users');

router.get('/signup', (request, response, next) => {
  response.render('users/signup');
});

router.post('/signup', (request, response, next) => {
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
      next(error);
    }
  });
});

router.get('/login', (request, response) => {
  response.render('users/login');
});

router.post('/login', (request, response, next) => {
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
  .catch(error => next(error));
});

router.get('/admin', (request, response) => {
  if (request.session.role === 'admin') {
    response.render('users/admin');
  } else {
    response.status(401).render('common/not_permitted');
  }
});

router.put('/admin/permissions', (request, response, next) => {
  if (request.session.role === 'admin') {
    const user = {
      login: request.body.login,
      role: request.body.role,
    };
    users.changeRole(user)
    .then((userId) => {
      if (userId.length > 0) {
        response.render('users/admin', { message: `User ${user.login} is now a ${user.role}.` });
      } else {
        response.render('users/admin', { errorMessage: `User ${user.login} not found.` });
      }
    })
    .catch(error => next(error));
  } else {
    response.status(401).render('common/not_permitted');
  }
});

router.get('/logout', (request, response) => {
  request.session.destroy();
  response.redirect('/');
});

router.delete('/cart', (request, respose) => {
  const userId = request.session.userId;
  const bookId = request.body.bookId;
  users.removeCartItem(userId, bookId)
  .then(result => response.send(`Cart Item ${bookId} has been deleted`))
  .catch(error => response.send(`Cart Item ${bookId} could not be deleted`));
});

router.put('/cart', (request, response) => {
  const userCart = {
    userId: request.session.userId,
    bookId: request.body.bookId,
    quantity: request.body.quantity,
  };
  users.addOrUpdateCart(userCart)
  .then(result => response.send('Cart has been updated'))
  .catch(error => response.send('Cart update went wrong'));
});

module.exports = router;
