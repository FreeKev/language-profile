const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Mysql Connected...');
});

const app = express();

app.get('/', (req, res) => {
  res.send('Up and running...');
})

// Create DB to Test MySQL connection
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE mywyc';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('database created...');
  });
});

app.listen('3000', () => {
  console.log('Server started on 3000')
});
