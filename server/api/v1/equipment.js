require('dotenv').config();
const { Router } = require('express');
const mysql = require('mysql');
const router = Router();

let mysqlCon;
try {
    mysqlCon = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database',
    multipleStatements: true
  });
} catch (error) {
  console.error('SQL connection failed');
  console.error(error);
}

mysqlCon.connect(error => {
  if(error) console.error(error);
  else console.log('Equipment connected!');
});

router.get('/', (req, res) => {
});

router.get('/location/:id', (req, res) => {
  try {
    mysqlCon.query(`SELECT equ_name as 'שם', eil_quantity as 'כמות', eil_notes as 'הערות'
    FROM sql_derech_haketzev.equipment_in_locations
    INNER JOIN sql_derech_haketzev.locations ON eil_location_id = loc_id
    INNER JOIN sql_derech_haketzev.equipment ON eil_equipment_id = equ_id
    INNER JOIN sql_derech_haketzev.equipment_types ON equ_type = eqt_id
    WHERE loc_id = ${req.params.id};`, (error, results, fields) => {
      if(error) throw error;
      res.send(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Cannot process request' });
  }
});

module.exports = router;
