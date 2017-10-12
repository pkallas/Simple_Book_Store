DROP DATABASE IF EXISTS Simple_Book_Store_Test;
CREATE DATABASE Simple_Book_Store_Test;

\c simple_book_store_test

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR (255),
  role VARCHAR(255) DEFAULT 'reader'
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255),
  price NUMERIC(100, 2),
  img_url VARCHAR(255),
  in_stock INTEGER,
  isbn VARCHAR(255),
  publisher VARCHAR(255)
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE authors_books (
  author_id INTEGER REFERENCES authors (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  book_id INTEGER REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE genres_books (
  genre_id INTEGER REFERENCES genres (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  book_id INTEGER REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE carts (
  user_id INTEGER REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  book_id INTEGER REFERENCES books (id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity INTEGER
);