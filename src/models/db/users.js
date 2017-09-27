const db = require('./db');
const bcrypt = require('bcrypt');

const create = (user) => {
  return bcrypt.hash(user.password, 10)
  .then(encryptedPassword => {
    db.query(`INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)`, [user.username, user.email, encryptedPassword])
    .then(result => console.log('Successfully created user'));
  })
  .catch(error => {
    console.error(error);
    throw error;
  });
};

const changeRole = (user) => {
  return db.query(`UPDATE users SET role = $2 WHERE username = $1 OR email = $1`,
  [user.login, user.role])
  .then(result => console.log('Successfully changed role'))
  .catch(error => console.error(error));
};

const get = (user) => {
  return db.one(`SELECT * FROM users WHERE username = $1 OR email = $1`,
  [user.login])
  .then(returnedUser => {
    return bcrypt.compare(user.password, returnedUser.password)
    .then(result => {
      if (result) {
        return returnedUser;
      }
      throw Error('Passwords do not match');
    });
  })
  .catch(error => {throw error});
};

module.exports = {
  create,
  changeRole,
  get,
};
