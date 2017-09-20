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
  return db.query(`SELECT title, price, img_url, in_stock, isbn, publisher, first_name, last_name,
  string_agg(genres.name, ', ') AS genres FROM books
  JOIN authors_books ON books.id = authors_books.book_id
  JOIN authors ON authors.id = authors_books.author_id
  JOIN genres_books ON books.id = genres_books.book_id
  JOIN genres ON genres.id = genres_books.genre_id
  WHERE books.id = $1
  GROUP BY title, price, img_url, in_stock, isbn, publisher, first_name, last_name`,
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

const updateBookGenres = (newGenreName, bookId, oldGenreName) => {
  return db.tx(transaction => {
    return transaction.oneOrNone('SELECT id FROM genres WHERE LOWER(name) = LOWER($1)', [newGenreName])
      .then(genreId => {
        if (!genreId) {
          return transaction.query(`
              INSERT INTO genres (name) VALUES ($1) RETURNING id
               `, [newGenreName])
               .then(ids => {
                return transaction.query(`
                 UPDATE genres_books SET genre_id = $1
                 WHERE genres_books.book_id = $2
                 AND genres_books.genre_id = (SELECT id FROM genres WHERE name = $3);
                 `, [ids[0].id, bookId, oldGenreName]);
              })
               .catch(console.error);
        } else {
          return transaction.query(`
            UPDATE genres_books SET genre_id = (SELECT id FROM genres WHERE LOWER(name) = LOWER($1))
	          WHERE genres_books.book_id = $2
	          AND genres_books.genre_id = (SELECT id FROM genres WHERE name = $3);
            `, [newGenreName, bookId, oldGenreName]);
        }
      })
      .catch(error => {
        console.error({ message: 'UpdateBookGenres Inner Transaction failed',
                        arguments: arguments, });
        throw error;
      });
  })
  .catch(error => {
    console.error({ message: 'UpdateBookGenres Outer Transaction failed',
                    arguments: arguments, });
    throw error;
  });
}

const updateBookAuthors = (newAuthorFirst, newAuthorLast, bookId, oldAuthorFirst, oldAuthorLast) => {
  return db.tx(transaction => {
    return transaction.oneOrNone(`SELECT id FROM authors
      WHERE LOWER(first_name) = LOWER($1)
      AND LOWER(last_name) = LOWER($2)
      `, [newAuthorFirst, newAuthorLast])
      .then(authorId => {
        if (!authorId) {
          return transaction.query(`
              INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING id
               `, [newAuthorFirst, newAuthorLast])
               .then(ids => {
                return transaction.query(`
                 UPDATE authors_books SET author_id = $1
                 WHERE authors_books.book_id = $2
                 AND authors_books.author_id = (SELECT id FROM genres WHERE first_name = $3
                 AND last_name = $4);
                 `, [ids[0].id, bookId, oldAuthorFirst, oldAuthorLast]);
              })
               .catch(console.error);
        } else {
          return transaction.query(`
            UPDATE authors_books SET author_id = (SELECT id FROM authors
            WHERE LOWER(first_name) = LOWER($1)
            AND LOWER(last_name) = LOWER($2))
            WHERE authors_books.book_id = $3
            AND authors_books.author_id = (SELECT id FROM genres WHERE first_name = $4
            AND last_name = $5);
            `, [newAuthorFirst, newAuthorLast, bookId, oldAuthorFirst, oldAuthorLast
            ]);
        }
      })
      .catch(error => {
        console.error({ message: 'UpdateBookGenres Inner Transaction failed',
                        arguments: arguments, });
        throw error;
      });
  })
  .catch(error => {
    console.error({ message: 'UpdateBookGenres Outer Transaction failed',
                    arguments: arguments, });
    throw error;
  });
};

const updateBooks = (bookId, bookTitle, bookImg, bookPrice, inStock, isbn, publisher) => {
  return db.query(`
    UPDATE books SET title = $2, img_url = $3, price = $4,
    in_stock = $5, isbn = $6, publisher = $7
    WHERE id = $1
    `, [bookId, bookTitle, bookImg, bookPrice, inStock, isbn, publisher])
    .catch(error => console.error(error));
};

module.exports = {
  getAllBooks,
  getOneBook,
  getAllBookImagesId,
  searchForBooks,
  updateBookGenres,
  updateBookAuthors,
  updateBooks,
};
