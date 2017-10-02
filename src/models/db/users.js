const db = require('./db');
const bcrypt = require('bcrypt');

const create = (user) => {
  return bcrypt.hash(user.password, 10)
  .then(encryptedPassword => {
    return db.query(`INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3) RETURNING id`, [user.username, user.email, encryptedPassword])
    .then(newUserId => newUserId[0].id);
  })
  .catch(error => {
    throw error;
  });
};

const changeRole = (user) => {
  return db.query(`UPDATE users SET role = $2 WHERE username = $1 OR email = $1 RETURNING id`,
  [user.login, user.role])
  .catch(error => {
    throw error;
  });
};

const getByLogin = (user) => {
  return db.oneOrNone(`SELECT * FROM users WHERE username = $1 OR email = $1`,
  [user.login])
  .catch(error => {
    throw error;
  });
};

const isValidPassword = (plaintextPassword, encryptedPassword) => {
  return bcrypt.compare(plaintextPassword, encryptedPassword)
  .catch(error => {
    throw error;
  });
};

const getCart = (userId) => {
  return db.query(`SELECT title, price, quantity FROM carts WHERE user_id = $1
    JOIN books ON books.id = carts.book_id
    `, [userId])
  .catch(error => {
    throw error;
  });
};;

const updateCart = (userId, cart) => {
  return db.query(`SELECT id FROM books WHERE title = $1`, [cart.title])
  .then(bookId => {
    return db.query(`UPDATE cart SET quantity = $3
      WHERE cart.user_id = $1 AND cart.book_id = $2
      `, [userId, bookId, cart.quantity]);
  })
  .catch(error => {
    throw error;
  });
};

module.exports = {
  create,
  changeRole,
  getByLogin,
  isValidPassword,
  getCart,
  updateCart,
};
