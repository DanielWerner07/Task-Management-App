import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const [steps, setSteps] = useState(['']);
  const [dueDate, setDueDate] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));
  const handleStepChange = (index, value) => {
    const newSteps = steps.map((step, i) => (i === index ? value : step));
    setSteps(newSteps);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!userId) {
      setError('User not logged in');
      return;
    }

    try {
      const formattedDueDate = dueDate ? dueDate.toISOString().split('T')[0] : null;
      const response = await axios.post('http://localhost:3001/api/create-task', { taskName, steps, dueDate: formattedDueDate, userId });
      alert(response.data.message);
      setTaskName('');
      setSteps(['']);
      setDueDate(null);
      navigate('/home');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        {steps.map((step, index) => (
          <div key={index}>
            <label>Step {index + 1}:</label>
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => removeStep(index)}>Remove Step</button>
          </div>
        ))}
        <button type="button" onClick={addStep}>Add Step</button>
        <div>
          <label>Due Date (optional):</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
      <button onClick={() => navigate('/home')}>Go to Home Page</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateTask;
