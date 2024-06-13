const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();

mongoose.connect('mongodb://localhost:27017/password-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered');
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
  res.json({ token });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
