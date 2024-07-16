// node server.js to start sever
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sdjw9@h8dD',
  database: 'taskApp'
});

const sessionStore = new MySQLStore({}, db);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // This is crucial for allowing cookies to be sent
}));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false } // Set to true if using HTTPS
}));

db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);

  // Create users table if it doesn't exist
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `, (err) => {
    if (err) throw err;
    console.log('Users table created or already exists');
  });

  // Create tasks table if it doesn't exist
  db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      name VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) throw err;
    console.log('Tasks table created or already exists');
  });

  // Create steps table if it doesn't exist
  db.query(`
    CREATE TABLE IF NOT EXISTS steps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task_id INT,
      description TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    )
  `, (err) => {
    if (err) throw err;
    console.log('Steps table created or already exists');
  });
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
