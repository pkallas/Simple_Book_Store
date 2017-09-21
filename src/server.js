const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./server/routes');
const middleware = require('./server/middleware');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.listen(port, ()=> {
  console.log(`http://localhost:${port}`);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(middleware);

app.use(routes);
