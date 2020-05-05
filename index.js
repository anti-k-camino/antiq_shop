const express = require('express');
const app = express();
// const path = require('path');

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('main', {
    foo: 4,
    bar: 7
  });
});

app.get('/cat', (req, res) => {
  res.send('cat');
});
// app.get("/cat", (req, res) => {
//   console.log("Running...");
//   // res.end('The end');
//   return res.render("index.html");
// });

app.listen(port, () => console.log(`Listening  on port ${port}...`));
