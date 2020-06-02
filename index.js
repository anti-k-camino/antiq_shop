const express = require('express');
const connection = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('antiq_shop/public'));
app.set('views', 'antiq_shop/views'); // just for dev !!!
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const results = connection.query('SELECT * FROM goods', (error, results) => {
      if (error) throw error;
      const goods = {};
      for(let i = 0; i < results.length; ++i) {
        goods[results[i]['id']] = results[i];
      }
      res.render('main', { results }); // Refactor to Promises
  });
});

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });
// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
