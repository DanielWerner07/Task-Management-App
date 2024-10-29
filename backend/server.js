const express = require('express');
const mysql = require('mysql2');
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
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the database with ID ', db.threadId);
});

// Create SQL tables on server startup

const createTables = () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL
    )
  `;

  const taskTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      name VARCHAR(255) NOT NULL,
      steps JSON NOT NULL,
      dueDate DATE,
      isCompleted BOOLEAN DEFAULT FALSE,
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

/* 
add new user to the user table by first validation the username and password. 
than it hashes the password and after adding to user table checks for and infos of errors.
*/

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (username.length < 3 || password.length < 5) {
    return res.status(400).json({ error: 'Invalid username or password length' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username already exists' });
      } else {
        console.error('Error during registration: ', err);
        return res.status(500).json({ error: 'Server error' });
      }
    }
    res.status(200).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

/*
takes login info entered by user and compares them to info in the user table.
if info doesn't match throws an error otherwise returns results to the AuthForm page.
*/

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error during login: ', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });
  });
});

/*
takes info user entered on the Create Task page and adds them as a new entry for the task table.
first it validates the info and convert the steps to JSON for storage
than it inserts the info into the table and throws errors if any occurs
*/

app.post('/api/create-task', (req, res) => {
  const { taskName, steps, dueDate, userId } = req.body;

  if (!taskName || !Array.isArray(steps) || steps.length === 0 || !userId) {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const stepsJSON = JSON.stringify(steps);

  const query = dueDate 
    ? 'INSERT INTO tasks (name, steps, dueDate, userId) VALUES (?, ?, ?, ?)'
    : 'INSERT INTO tasks (name, steps, userId) VALUES (?, ?, ?)';

  const params = dueDate 
    ? [taskName, stepsJSON, dueDate, userId]
    : [taskName, stepsJSON, userId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error during task creation:', err);
      return res.status(500).json({ error: 'Failed to create task' });
    }
    res.status(200).json({ message: 'Task created successfully' });
  });
});

/*
when a user loads the Home page it will use this to fetch the tasks the users has entered.
*/

app.get('/api/tasks/:userId', (req, res) => {
  const { userId } = req.params;

  db.query('SELECT * FROM tasks WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.status(200).json(results);
  });
});

/*
Updates the is Completed column of a task when the users selects it on the home page.
*/

app.put('/api/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { isCompleted } = req.body;

  db.query('UPDATE tasks SET isCompleted = ? WHERE id = ?', [isCompleted, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Failed to update task' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  });
});

/*
fetches the users info when they load into the Account page.
*/

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  db.query('SELECT username, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
