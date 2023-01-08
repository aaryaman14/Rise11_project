// first install all necessary packages
// using npm install express mongodb bcrypt

//setting up server
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();

// incoming requests to json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mongodb database connection
const mongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  const db = client.db('mydb');
  const usersCollection = db.collection('users');
});

// signup 
app.post('/signup', (req, res) => {
  const user = req.body;

  // password hashing for security
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  // saving the user
  usersCollection.insertOne(user, (err, result) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});

// login
app.post('/login', (req, res) => {
  const user = req.body;

  // findig the user
  usersCollection.findOne({ email: user.email }, (err, result) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    if (!result) {
      return res.sendStatus(401);
    }

    // comparing the passwords
    if (!bcrypt.compareSync(user.password, result.password)) {
      return res.sendStatus(401);
    }

    res.sendStatus(200);
  });
});
