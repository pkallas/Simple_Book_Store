const db = require('./db');

const getAllBooks = () => {
  return db.query(`SELECT * FROM books`)
  .catch(error => console.error(error));
};

const getAllBookImagesId = () => {
  return db.query(`SELECT id, img_url FROM books`)
  .catch(error => console.error(error));
};

const getOneBook = bookID => {
  return db.query(`SELECT books.id, title, price, img_url, in_stock, isbn, publisher,
  array_agg(DISTINCT first_name) AS first_names,
  array_agg(DISTINCT last_name) AS last_names,
  array_agg(DISTINCT genres.name) AS genres FROM books
  JOIN authors_books ON books.id = authors_books.book_id
  JOIN authors ON authors.id = authors_books.author_id
  JOIN genres_books ON books.id = genres_books.book_id
  JOIN genres ON genres.id = genres_books.genre_id
  WHERE books.id = $1
  GROUP BY books.id, title, price, img_url, in_stock, isbn, publisher
  ORDER BY books.id`,
  [bookID])
  .then(book => book[0])
  .catch(error => console.error(error));
};

const searchForBooks = (searchQuery, offSet) => {
  return db.query(`SELECT books.id, title, price, img_url, first_name, last_name FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE LOWER(title) LIKE $1
    OR LOWER(first_name) LIKE $1
    OR LOWER(last_name) LIKE $1
    OR LOWER(name) LIKE $1
    GROUP BY books.id, title, price, img_url, first_name, last_name
    OFFSET $2 LIMIT 10`, [searchQuery, offSet])
    .catch(error => console.error(error));
};

const updateBook = (bookId, bookTitle, bookImg, bookPrice, inStock, isbn, publisher) => {
  return db.query(`
    UPDATE books SET title = $2, img_url = $3, price = $4,
    in_stock = $5, isbn = $6, publisher = $7
    WHERE id = $1
    `, [bookId, bookTitle, bookImg, bookPrice, inStock, isbn, publisher])
    .catch(error => console.error(error));
};

const getAllGenres = () => {
  return db.query(`SELECT name FROM genres`)
  .catch(error => console.error(error));
};

const deleteBook = (bookId) => {
  return db.query(`DELETE FROM books WHERE id = $1`, [bookId])
  .catch(error => console.error(error));
};

const createBook = (title, price, image, inStock, isbn, publisher) => {
  return db.query(`INSERT INTO books (title, price, img_url, in_stock, isbn, publisher)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
  `, [title, price, image, inStock, isbn, publisher])
  .catch(error => console.error(error));
};

const addOrEditAuthors = (bookId, authors) => {
  return db.tx(transaction => {
    const queries = [];
    queries.push(
      transaction.any(`SELECT * FROM authors_books WHERE book_id = $1
        `, [bookId])
        .then(authorConnections => {
          if (authorConnections) {
            return transaction.query(`DELETE FROM authors_books
              WHERE book_id = $1`, [bookId]);
          }
        })
        .catch(error => {
          console.error({ message: 'addorEditAuthors Delete failed' });
          throw error;
        })
    );
    authors.forEach(author => {
      queries.push(
        transaction.oneOrNone(`SELECT id FROM authors
          WHERE LOWER(first_name) = LOWER($1)
          AND LOWER(last_name) = LOWER($2)
          `, [author.firstName, author.lastName])
          .then(authorId => {
            if (!authorId) {
              return transaction.query(`INSERT INTO authors (first_name, last_name)
              VALUES ($1, $2) RETURNING id`, [author.firstName, author.lastName])
              .then(newAuthor => {
                return transaction.query(`INSERT INTO authors_books (author_id, book_id)
                VALUES ($1, $2)`, [newAuthor.id, bookId])
                .catch(error => {
                  console.error({ message: 'addorEditAuthors Create New AuthorId and BookId failed'});
                  throw error;
                });
              })
              .catch(error => {
                console.error({ message: 'addorEditAuthors Create New AuthorId failed'});
                throw error;
              });
            } else {
              return transaction.query(`INSERT INTO authors_books (author_id, book_id)
              VALUES ($1, $2)`, [authorId.id, bookId])
              .catch(error => {
                console.error({ message: 'addorEditAuthors Create from existing author failed'});
                throw error;
              });
            }
          })
          .catch(error => {
            console.error({ message: 'addorEditAuthors Create New Author failed'});
            throw error;
          })
      );
    });
    return transaction.batch(queries)
    .catch(error => {
      console.error({ message: 'addorEditAuthors batch failed'});
      throw error;
    });
  });
};

const addOrEditGenres = (bookId, genres) => {
  return db.tx(transaction => {
    const queries = [];
    queries.push(
      transaction.any(`SELECT * FROM genres_books WHERE book_id = $1`,
      [bookId])
      .then(genreConnections => {
        if (genreConnections) {
          return transaction.query(`DELETE FROM genres_books
            WHERE book_id = $1`, [bookId]);
        }
      })
      .catch(error => {
          console.error({ message: 'addGenres Delete failed', });
          throw error;
        })
    );
    genres.forEach(genre => {
      queries.push(transaction.oneOrNone(`'SELECT id FROM genres WHERE LOWER(name) = LOWER($1)',
      `, [genre])
      .then(genreId => {
        if (!genreId) {
          return transaction.query(`INSERT into genres (name) VALUES $1 RETURNING id`, [genre])
          .then(newGenre => {
            return transaction.query(`INSERT into genres_books (genre_id, book_id)
            VALUES ($1, $2)`, [newGenre.id, bookId])
            .catch(error => {
                console.error({ message: 'addGenres Inner Transaction 1 failed', });
                throw error;
              });
          })
          .catch(error => {
              console.error({ message: 'addGenres Inner Transaction 2 failed', });
              throw error;
            });
        } else {
          return transaction.query(`INSERT into genres_books (genre_id, book_id)
          VALUES ($1, $2)`, [genreId.id, bookId])
          .catch(error => {
              console.error({ message: 'addGenres Inner Transaction 3 failed', });
              throw error;
            });
        }
      })
      .catch(error => {
        console.error({ messsage: 'addGenres push Transaction failed', });
        throw error;
      })
    );
    });
    transaction.batch(queries)
    .catch(error => {
        console.error({ message: 'addGenres Batch Transaction failed', });
        throw error;
      });
  })
  .catch(error => {
      console.error({ message: 'addGenres OuterMost Transaction failed', });
      throw error;
    });
};

module.exports = {
  getAllBooks,
  getOneBook,
  getAllBookImagesId,
  searchForBooks,
  updateBook,
  getAllGenres,
  deleteBook,
  createBook,
  addOrEditAuthors,
  addOrEditGenres,
};
