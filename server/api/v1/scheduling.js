require('dotenv').config();
const { Router } = require('express');
const mysql = require('mysql');
const router = Router();

let mysqlCon = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'database',
  multipleStatements: true
});

mysqlCon.connect(error => {
  if(error) console.error(error);
  else console.log('Connected!');
});

router.get('/', (req, res) => {
});
module.exports = router;
