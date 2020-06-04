const express = require('express');
const connection = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('antiq_shop/public')); // just for dev purposes !
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

app.get('/category', (req, res) => {
  // console.log(`QUERY ${req.query.id}`)
  const catId = req.query.id;
  if (!catId) // validate req
    return res.status(400).send('Malformed URL. Bad request.');
  const category = new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM category WHERE id = ${catId}`, (err, catArr) => {
        if (err) reject(err);
        const catObj = catArr[0];
        resolve(catObj);
      });
  });
  const goods = new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM goods WHERE category = ${catId}`, (err, goodsArr) => {
        if (err) reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i) {
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        }
        resolve(goodsObj);
      });
  });
  Promise.all([category, goods])
    .then(val => console.log('Result value ', val));
  res.render('category', {});
});

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });
// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
