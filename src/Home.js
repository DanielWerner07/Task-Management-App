import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId'); // Get userId from local storage

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect to login if userId is not found
    } else {
      fetchTasks();
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

  const handleTaskCompletion = async (taskId, isCompleted) => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/${taskId}`, { isCompleted });
      fetchTasks(); // Refresh tasks list after updating completion status
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={() => navigate('/create-task')}>
        Create New Task
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
            <h3>{task.name}</h3>
            <p>{JSON.stringify(task.steps)}</p>
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
