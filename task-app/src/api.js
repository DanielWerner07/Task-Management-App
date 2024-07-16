import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

app.post('/api/tasks', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Task name is required' });
  }

  const sql = 'INSERT INTO tasks (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ id: result.insertId, name });
  });
});