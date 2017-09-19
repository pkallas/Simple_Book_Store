const db = require('./db');

const getAllBooks = () => {
  return db.query(`SELECT * FROM books`)
    .then(books => books.rows)
    .catch(err => console.error(err));
};

const getAllBookImages = () => {
  return db.query(`SELECT img_url FROM books`)
    .then(books => books.rows)
    .catch(err => console.error(err));
};

const getOneBook = bookID => {
  return db.query(`SELECT title, price, img_url, in_stock, isbn, publisher, first_name, last_name,
  string_agg(genres.name, ', ') AS genres FROM books
  JOIN authors_books ON books.id = authors_books.book_id
  JOIN authors ON authors.id = authors_books.author_id
  JOIN genres_books ON books.id = genres_books.book_id
  JOIN genres ON genres.id = genres_books.genre_id
  WHERE books.id = $1
  GROUP BY title, price, img_url, in_stock, isbn, publisher, first_name, last_name`,
  [bookID])
  .then(book => book.rows[0])
  .catch(err => console.error(err));
};

module.exports = {
  getAllBooks,
  getOneBook,
  getAllBookImages,
};
