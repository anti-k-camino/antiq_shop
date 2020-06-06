const express = require('express');
const connection = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('antiq_shop/public')); // just for dev purposes !
app.set('views', 'antiq_shop/views'); // just for dev !!!
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  getGoods()
    .then( goods => res.render('main', { goods }) );
});

app.get('/goods', (req, res) => {
  const goodId = req.query.id;
  if (!goodId) // validate query
    return res.status(400).send('Bad request, malformed URL.');
  getGood(goodId)
    .then(good => {
      return res.render('good', { good });
    });
});

app.get('/category', (req, res) => {
  const catId = req.query.id;
  if (!catId) // validate req
    return res.status(400).send('Bad request, malformed URL.');
  Promise.all([getCategory(catId), getGoodsByCat(catId)])
    .then(val => {
      return res.render('category', {
        category: val[0],
        goods: val[1]
      });
    });
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

function getGoodsByCat (catId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM goods WHERE category = ${catId}`, (err, goodsArr) => {
        if (err) reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i){
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        }
        resolve(goodsObj);
      });
  });
};

function getCategory (catId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM category WHERE id = ${catId}`, (err, catArr) => {
        if (err) reject(err);
        // if (!catArr[0]) reject({ message: 'Not Found' , status: 404 }); !! Provide this validation !!
        resolve(catArr[0]); // resolves pure object
      });
  });
};

function getGood (goodId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM goods WHERE id = ${goodId}`, (err, goodArr) => {
        if (err) reject(err);
        resolve(goodArr[0]);
      });
  });
};

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });
// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
