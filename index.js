const express = require('express');
const connection = require('./db');
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

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });

connection.query('SELECT * FROM category', (error, results, fields) => {
    if (error) throw error;
    results.forEach(result => console.log(result));
});

// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
