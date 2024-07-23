import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
    } else {
      fetchTasks();
      fetchUserEmail();
    }
  }, [userId, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tasks/${userId}`);
      setTasks(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const fetchUserEmail = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/${userId}`);
      setEmail(response.data.email);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/user/${userId}/email`, { email: newEmail });
      setEmail(newEmail);
      setNewEmail('');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleTaskCompletion = async (taskId, isCompleted) => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/${taskId}`, { isCompleted });
      fetchTasks();
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={() => navigate('/create-task')}>Create New Task</button>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Your Email</h2>
        {email ? (
          <div>
            <p>Current Email: {email}</p>
            <form onSubmit={handleEmailSubmit}>
              <label>
                New Email:
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
              <button type="submit">Update Email</button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            <label>
              Email:
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>
            <button type="submit">Submit Email</button>
          </form>
        )}
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
            <h3>{task.name}</h3>
            <p>Due Date: {task.dueDate}</p>
            <p>Steps: {JSON.stringify(task.steps)}</p>
            <label>
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleTaskCompletion(task.id, !task.isCompleted)}
              />
              Completed
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
