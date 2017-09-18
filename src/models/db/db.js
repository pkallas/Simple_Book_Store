const { Client } = require('pg');
const client = new Client({
  user: 'pkallas',
  host: process.env.DATABASE_ENV || 'localhost',
  database: 'simple_book_store',
  port: 5432,
});

client.connect();

module.exports = client;
