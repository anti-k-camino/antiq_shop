const express = require('express');
const connection = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('antiq_shop/public')); // just for dev purposes !
app.set('views', 'antiq_shop/views'); // just for dev !!!
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  getGoods().then( goods => res.render('main', { goods }) );
});

app.get('/category', (req, res) => {
  const catId = req.query.id;
  if (!catId) // validate req
    return res.status(400).send('Malformed URL. Bad request.');
  const category = new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM category WHERE id = ${catId}`, (err, catArr) => {
        if (err) reject(err);
        resolve(catArr[0]); // resolves pure object
      });
  });
  Promise.all([category, getGoods()])
    .then(val => console.log('Result value ', val));
  res.render('category', {});
});

function getGoods () {
  return new Promise((resolve, reject) => {
    connection
      .query('SELECT * FROM goods', (err, goodsArr) => {
        if (err) reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i){
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        }
        resolve(goodsObj);
      });
  });
};

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });
// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
