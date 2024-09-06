// app.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const getRoutes = require('./router/get')

const app = express();

const db = new sqlite3.Database('db.db');

app.use(getRoutes); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();

  db.run("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, createdAt], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error during sign up' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Sign In Route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error during sign in' });
    }
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    
    res.cookie('token', token, { httpOnly: true });

    res.render('/home');
  });
});

// Home Route
app.get('/home', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    db.get("SELECT * FROM users WHERE id = ?", [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching user' });
      }
      res.render('client/home', { user });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
