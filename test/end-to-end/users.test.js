const chai = require('chai');
const expect = chai.expect;
const port = 'http://localhost:3000';
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
