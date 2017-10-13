process.env.DATABASE_URL = 'postgres://localhost:5432/simple_book_store_test';
const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/server');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
