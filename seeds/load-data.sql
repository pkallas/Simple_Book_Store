\c simple_book_store

COPY books (title, img_url, price, in_stock, isbn, publisher) FROM '/Users/pkallas/Desktop/Simple_Book_Store/seeds/csv/books.csv' DELIMITERS ',' CSV;
COPY authors (first_name, last_name) FROM '/Users/pkallas/Desktop/Simple_Book_Store/seeds/csv/authors.csv' DELIMITERS ',' CSV;
COPY genres (name) FROM '/Users/pkallas/Desktop/Simple_Book_Store/seeds/csv/genres.csv' DELIMITERS ',' CSV;
COPY authors_books (author_id, book_id) FROM '/Users/pkallas/Desktop/Simple_Book_Store/seeds/csv/authors_books.csv' DELIMITERS ',' CSV;
COPY genres_books (genre_id, book_id) FROM '/Users/pkallas/Desktop/Simple_Book_Store/seeds/csv/genres_books.csv' DELIMITERS ',' CSV;
