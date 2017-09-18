const db = require('./db');

const getAllBooks = function () {
  return db.query(`SELECT * FROM books`)
    .then(res => console.log(res))
    .catch(err => console.error(err));
};

getAllBooks();
