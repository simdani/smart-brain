const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// load controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

// connect to database
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'testas',
    database: 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json('ok');
});

// make sign in request
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});
// get user pfofile
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});
// update user image entries
app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});
// register new user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});