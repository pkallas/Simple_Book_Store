DROP DATABASE IF EXISTS Simple_Book_Store;
CREATE DATABASE Simple_Book_Store;

\c simple_book_store

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
  author VARCHAR(255),
  summary TEXT,
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
  name VARCHAR(255)
);

CREATE TABLE authors_books (
  author_id INTEGER REFERENCES authors (id),
  book_id INTEGER REFERENCES books (id)
);

CREATE TABLE genres_books (
  genre_id INTEGER REFERENCES genres (id),
  book_id INTEGER REFERENCES books (id)
);
