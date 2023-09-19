const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'})

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

module.exports = connection;