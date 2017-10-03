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
  return db.query(`SELECT books.id, title, price, quantity FROM carts
    JOIN books ON books.id = carts.book_id
    WHERE user_id = $1
    `, [userId])
  .catch(error => {
    throw error;
  });
};;

const addOrUpdateCart = (userCart) => {
  return db.query(`DELETE FROM carts WHERE cart.user_id = $1 AND cart.book_id = $2
    `, [userCart.userId, userCart.bookId])
  .then(() => {
    return db.query(`INSERT INTO carts (user_id, book_id, quantity)
      VALUES ($1, $2, $3)
      `, [userCart.userId, userCart.bookId, userCart.quantity]);
  })
  .catch(error => {
    throw error;
  });
};

const removeFromCart = (userId, bookId) => {
  return db.query(`DELETE FROM carts WHERE cart.user_id = $1 AND cart.book_id = $2
    `, [userId, bookId])
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
  addOrUpdateCart,
  removeFromCart,
};
