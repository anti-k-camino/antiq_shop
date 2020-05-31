const mysql = require('mysql');
module.exports = mysql.createPool({
  host: 'localhost',
  database: 'mall_db',
  user: 'antiq',
  password: 'debian984',
  connectionLimit: 10
});
