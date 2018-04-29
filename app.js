require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mysql = require('mysql');
// const session = require('express-session');
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
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

app.get('/', (req, res) => {
  let sql = `Select
                l.name as languageName,
                l.description as langDesc,
                l.population as langPop,
                l.iso_language_code as lIso,
                l.country_id as lcId,
                p.name as projectName,
                p.description as pDesc,
                p.goal_amount as goal,
                p.funded_amount as funded,
                f.question as faqQ,
                f.answer as faqA,
                c.name as countryName,
                c.population as cPop,
                c.lat as lat,
                c.lng as lng
              FROM
                languages as l,
                projects as p,
                faqs as f,
                faqs_related_projects as frp,
                countries as c
              WHERE
                l.id = p.language_id AND
                f.id = frp.faq_id AND
                p.id = frp.project_id AND
                p.country_id = c.id AND
                l.name = 'ARUAMU';`;
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    // console.log(results);
    // console.log('Country Fetched...');
    res.render('home', {result: results});
    // res.send(results);
  });
});

app.get('/createpoststable', (req, res) => {
  let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send('Posts talbe created');
  });
});

app.post('/signup', (req, res) => {
  console.log('req.body is', req.body);
  console.log(req.body.email[1]);
  let post = {first_name: req.body.fname, last_name: req.body.lname, full_name: req.body.fname + ' ' + req.body.lname, email: req.body.email[1] };
  let sql = 'INSERT INTO email_signups SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.render('signup')
  });
});

app.get('/signup', (req, res) => {
  res.render('signup')
});

app.post('/update-cart', (req, res) => {
  console.log("GIFTS", req.body.gifts);
  let cartId = req.body.cartId;
  let cartContents = { projectName: req.body.projectName, items: req.body.gifts};
  let post = { info: JSON.stringify(cartContents)}
  let sql ='';
  // console.log("CART ID: " + cartId);
  if (cartId) {
    // TODO: this is not safe
    console.log("UPDATING CART");
    sql = 'UPDATE carts SET ? WHERE carts.id = ' + cartId;
  }
  else {
    sql = 'INSERT INTO carts SET ?';
  }
  // console.log('SQL query', sql);
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    let insertId = result.insertId;
    let message = {};
    if (insertId > 0) {
      message.cartId = insertId;
    }
    res.send(message);
  });
});

app.get('/mycart', (req, res) => {
  res.render('donate')
});

app.listen('3000', () => {
  console.log('Server started on 3000')
});
