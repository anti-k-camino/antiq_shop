const express = require('express');
const connection = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
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

app.post('/get-category-list', (req, res) => {
  getCategoryList()
    .then(categories => res.json(categories));
});

app.post('/get-goods-info', (req, res) => {
  fetchGoodsInfo(req.body)
    .then(resObj => {
      res.json(resObj);
    });
});

function fetchGoodsInfo (data) {
  return new Promise((resolve, reject) => {
    if (!data.key.length)
      return resolve({ message: '0' }); // check that out with care !
    connection
      .query(`SELECT id,name,cost FROM goods WHERE id IN (${data.key.join(', ')})`, (err, goodsArr) => {
        if (err) return reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i){
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        };
        return resolve(goodsObj);
    });
  });
};

function getCategoryList () {
  return new Promise((resolve, reject) => {
    connection.query('SELECT id, category FROM category', (err, catsArr) => {
      if (err) return reject(err);
      const catsObj = {};
      for(let i = 0; i < catsArr.length; ++i){
        catsObj[catsArr[i]['id']] = catsArr[i];
      };
      return resolve(catsObj);
    });
  });
};

function getGoods () {
  return new Promise((resolve, reject) => {
    connection
      .query('SELECT * FROM goods', (err, goodsArr) => {
        if (err) return reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i){
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        }
        return resolve(goodsObj);
      });
  });
};

function getGoodsByCat (catId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM goods WHERE category = ${catId}`, (err, goodsArr) => {
        if (err) return reject(err);
        const goodsObj = {};
        for(let i = 0; i < goodsArr.length; ++i){
          goodsObj[goodsArr[i]['id']] = goodsArr[i];
        }
        return resolve(goodsObj);
      });
  });
};

function getCategory (catId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM category WHERE id = ${catId}`, (err, catArr) => {
        if (err) return reject(err);
        return resolve(catArr[0]); // resolves pure object
      });
  });
};

function getGood (goodId) {
  return new Promise((resolve, reject) => {
    connection
      .query(`SELECT * FROM goods WHERE id = ${goodId}`, (err, goodArr) => {
        if (err) return reject(err);
        return resolve(goodArr[0]);
      });
  });
};

// connection.connect(err => {
//     if (err) return console.error('Error connecting: ' + err.stack);
//     console.log('Connected as threadId ', connection.threadId);
// });
// connection.end();

app.listen(port, () => console.log(`Listening  on port ${port}...`));
