process.env.DATABASE_URL = 'postgres://localhost:5432/simple_book_store_test';
const db = require('../src/models/db/db');

const truncateBooks = () => {
  return db.query(`TRUNCATE books RESTART IDENTITY CASCADE`);
};

const truncateAuthors = () => {
  return db.query(`TRUNCATE authors RESTART IDENTITY CASCADE`);
};

const truncateGenres = () => {
  return db.query(`TRUNCATE genres RESTART IDENTITY CASCADE`);
};

const seedBooks = () => {
  return db.query(`INSERT INTO books (title, price, img_url, in_stock, isbn, publisher)
  VALUES ('How Few Remain', 4.54, 'How Few Remain Image', 5, '8487582', 'Del Rey'),
  ('Harry Potter', 7.99, 'Harry Potter Image', 3, '83758274', 'Scholastic'),
  ('Lord of the Rings', 15.55, 'LotR Image', 20, '57657', 'Del Rey')`);
};

const seedAuthors = () => {
  return db.query(`INSERT INTO authors (first_name, last_name)
  VALUES ('Harry', 'Turtledove'), ('J. K.', 'Rowling'), ('J. R. R.', 'Tolkien')`);
};

const seedGenres = () => {
  return db.query(`INSERT INTO genres (name)
  VALUES ('alternate history'), ('fiction'), ('fantasy')`);
};

const seedAuthorsBooks = () => {
  return db.query(`INSERT INTO authors_books (author_id, book_id)
  VALUES (1, 1), (2, 2), (3, 3)`);
};

const seedGenresBooks = () => {
  return db.query(`INSERT INTO genres_books (genre_id, book_id)
  VALUES (1, 1), (2, 1), (2, 2), (3, 2), (2, 3), (3, 3)`);
}

module.exports = {
  db,
  truncateBooks,
  truncateAuthors,
  truncateGenres,
  seedBooks,
  seedAuthors,
  seedGenres,
  seedAuthorsBooks,
  seedGenresBooks,
};
