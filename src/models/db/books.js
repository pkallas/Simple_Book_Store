const db = require('./db');

const getAllBooks = function () {
  return db.query(`SELECT * FROM books`)
    .then(users => users.rows)
    .catch(err => console.error(err));
};

module.exports = {
  getAllBooks,
};
