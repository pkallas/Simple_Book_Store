require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_ENV,
  database: 'simple_book_store',
  port: process.env.DATABASE_PORT,
});

client.connect();

module.exports = client;
