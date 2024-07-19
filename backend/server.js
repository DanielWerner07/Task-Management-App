// node server.js to start sever
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

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

const createTables = () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  const taskTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      userId INT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `;

  db.query(userTable, (err) => {
    if (err) throw err;
    console.log('Users table created');
  });

  db.query(taskTable, (err) => {
    if (err) throw err;
    console.log('Tasks table created');
  });
};

createTables();

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (username.length < 3 || password.length < 5) {
    return res.status(400).json({ error: 'Invalid username or password length' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'User already exists' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  });
});

app.post('/api/create-task', (req, res) => {
  const { taskName, steps } = req.body;
  const userId = 1; // Assuming we use a static user ID for simplicity

  db.query('INSERT INTO tasks (name, userId) VALUES (?, ?)', [taskName, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create task' });
    }

    const taskId = result.insertId;

    const stepPromises = steps.map(step => {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO steps (taskId, step) VALUES (?, ?)', [taskId, step], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(stepPromises)
      .then(() => res.status(200).json({ message: 'Task created successfully' }))
      .catch(() => res.status(500).json({ error: 'Failed to create task steps' }));
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
