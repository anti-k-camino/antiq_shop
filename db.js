const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    database : 'shop_schema',
    user     : 'antiq',
    password : 'debian984',
});

module.exports = connection;
