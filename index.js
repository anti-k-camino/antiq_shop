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
  Promise.all([category, getGoods(catId)])
    .then(val => {
      console.log(val[1]);
      return res.render('category', {
        category: val[0],
        goods: val[1]
      });
    });
});

function getGoods (key=0) {
  let queryString =  '';
  if (key === 0) {
    queryString = 'SELECT * FROM goods'
  } else {
    queryString = `SELECT * FROM goods WHERE category = ${key}`
  }
  return new Promise((resolve, reject) => {
    connection
      .query(queryString, (err, goodsArr) => {
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
