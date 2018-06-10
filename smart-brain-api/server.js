const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

const database = {
  users: [
    {
      id: '123',
      name: 'john',
      password: 'test',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'sally',
      password: 'test',
      email: 'kaa@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  // bcrypt.compare("veggies", hash, function(err, res) {
  //   console.log('success');
  // });

  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
      res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;

  db.select('*')
    .from('users')
    .where({
      id: id
    })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('user not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(400).json('user not found');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });

  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register.'));
});

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });

const port = 5000;
app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});