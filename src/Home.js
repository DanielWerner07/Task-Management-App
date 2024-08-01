import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gapi } from 'gapi-script';
import config from './config';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [isCalendarApiLoaded, setIsCalendarApiLoaded] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: config.googleClientId,
        scope: 'email profile https://www.googleapis.com/auth/calendar',
      }).then(() => {
        return gapi.client.load('calendar', 'v3');
      }).then(() => {
        setIsCalendarApiLoaded(true);
      }).catch((error) => {
        console.error('Error loading Google Calendar API:', error);
      });
    }
    gapi.load('client:auth2', start);

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

  const formatDueDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const addEventToGoogleCalendar = (task) => {
    if (!isCalendarApiLoaded) {
      console.error('Google Calendar API is not loaded yet');
      return;
    }

    const auth2 = gapi.auth2.getAuthInstance();
    const isSignedIn = auth2.isSignedIn.get();

    if (!isSignedIn) {
      console.error('User not signed in to Google');
      return;
    }

    const event = {
      summary: task.name,
      description: `Task steps: ${JSON.stringify(task.steps)}`,
      start: {
        dateTime: `${task.dueDate}T00:00:00Z`,
        timeZone: 'UTC'
      },
      end: {
        dateTime: `${task.dueDate}T23:59:59Z`,
        timeZone: 'UTC'
      },
    };

    gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    }).then(response => {
      console.log('Event created:', response.result.htmlLink);
      alert('Event created in Google Calendar');
    }).catch(error => {
      console.error('Error creating event:', error);
      alert('Failed to create event in Google Calendar');
    });
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
