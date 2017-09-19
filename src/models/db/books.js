const db = require('./db');

const getAllBooks = () => {
  return db.query(`SELECT * FROM books`)
    .then(books => books.rows)
    .catch(err => console.error(err));
};

const getAllBookImagesId = () => {
  return db.query(`SELECT id, img_url FROM books`)
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

const searchForBooks = (searchQuery, offSet) => {
  return db.query(`SELECT title, price, img_url, first_name, last_name FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE LOWER(title) LIKE $1
    OR LOWER(first_name) LIKE $1
    OR LOWER(last_name) LIKE $1
    OR LOWER(name) LIKE $1
    GROUP BY title, price, img_url, first_name, last_name
    OFFSET $2 LIMIT 10`, [searchQuery, offSet])
    .then(book => book.rows)
    .catch(err => console.error(err));
};

module.exports = {
  getAllBooks,
  getOneBook,
  getAllBookImagesId,
  searchForBooks,
};
