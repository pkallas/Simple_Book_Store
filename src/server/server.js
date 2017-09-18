const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

app.set('view engine', 'ejs');

app.listen(port, ()=> {
  console.log(`http://localhost:${port}`);
});

app.use(routes);
