const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  database : 'wyc'
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

app.get('/createpoststable', (req, res) => {
  let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if(err) console.log(err);
    console.log(result);
    res.send('Posts talbe created');
  });
});

app.get('/addpost1', (req, res) => {
  let post = {title: 'Post 1', body:'This is post UNO'};
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post 1 Added...');
  });
});

app.get('/addpost2', (req, res) => {
  let post = {title: 'Post 2', body:'This is post DOS'};
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post 2 Added...');
  });
});

// Select posts
app.get('/getposts', (req, res) => {
  let sql = 'SELECT * FROM posts';
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send('Posts Fetched...');
  });
});

// Select posts
app.get('/getpost/:id', (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post Fetched...');
  });
});

// Update
app.get('/updatepost/:id', (req, res) => {
  let newTitle = 'Updated Title';
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post Updated...');
  });
});

// Delete Post
app.get('/deletepost/:id', (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post Deleted...');
  });
});

app.listen('3000', () => {
  console.log('Server started on 3000')
});
