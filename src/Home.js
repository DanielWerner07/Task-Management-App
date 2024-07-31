import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
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
    <div className="home-container">
      <h1>Welcome to the Home Page!</h1>
      <div className="buttons-container">
        <button onClick={() => navigate('/create-task')} className="button">
          Create New Task
        </button>
        <button onClick={() => navigate('/account')} className="button">
          Account
        </button>
        <button onClick={handleLogout} className="button logout-button">
          Logout
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <h3>{task.name}</h3>
            <p>Due Date: {task.dueDate || 'No due date'}</p>
            <p>Steps: {JSON.stringify(task.steps)}</p>
            <label className="completion-label">
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
