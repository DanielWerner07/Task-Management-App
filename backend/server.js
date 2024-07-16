const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sdjw9@h8dD',
  database: 'taskApp'
});

db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (username.length < 3 || password.length < 5) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'User registered' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
      req.session.user = user;
      res.json({ message: 'User logged in' });
    });
  });
});

app.post('/api/tasks', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { taskName, steps } = req.body;
  db.query('INSERT INTO tasks (user_id, name) VALUES (?, ?)', [req.session.user.id, taskName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const taskId = result.insertId;
    const stepValues = steps.map(step => [taskId, step]);
    db.query('INSERT INTO steps (task_id, description) VALUES ?', [stepValues], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Task created' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
