import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gapi } from 'gapi-script';
import config from './config';
import { initGoogleCalendarApi, addEventToGoogleCalendar } from './GoogleCalendar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    initGoogleCalendarApi(config.googleClientId);
    
    // will send the user back to the authform page if they are not logged in(no userId in local storage)
    if (!userId) {
      navigate('/');
    } else {
      fetchTasks();
    }
  }, [userId, navigate]);

  // gets tasks from the sql database with the users ID 
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tasks/${userId}`);
      setTasks(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  //updates a task in the database when a user clicks complete
  const handleTaskCompletion = async (taskId, isCompleted) => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/${taskId}`, { isCompleted });
      fetchTasks();
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  //removes a users userID from the local storage and logs them out of google then redirects them to the Authform page
  const handleLogout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      localStorage.removeItem('userId');
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out from Google:', error);
      localStorage.removeItem('userId');
      navigate('/');
    });
  };

  //used to sign a user in to google
  const handleGoogleSignIn = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      const id_token = googleUser.getAuthResponse().id_token;
      localStorage.setItem('googleIdToken', id_token);
    }).catch((error) => {
      console.error('Error signing in with Google:', error);
    });
  };

  //formats tasks due dates to better display them
  const formatDueDate = (dateString) => {
    const options = { year: 'numeric' , month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
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
        <button onClick={handleGoogleSignIn} className="button google-signin-button">
          Sign in with Google
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <h3>{task.name}</h3>
            <p>Due Date: {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}</p>
            <p>Steps: {JSON.stringify(task.steps)}</p>
            <label className="completion-label">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleTaskCompletion(task.id, !task.isCompleted)}
              />
              Completed
            </label>
            {task.dueDate && (
              <button
                onClick={() => addEventToGoogleCalendar(task)}
                className="button add-to-calendar-button"
              >
                Add to Google Calendar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
