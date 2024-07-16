import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const [steps, setSteps] = useState(['']);
  const [error, setError] = useState('');

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index] = event.target.value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/tasks', { taskName, steps }, { withCredentials: true });
      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'An error occurred');
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={handleTaskNameChange}
          />
        </div>
        <div>
          <label>Steps:</label>
          {steps.map((step, index) => (
            <div key={index}>
              <input
                type="text"
                value={step}
                onChange={(event) => handleStepChange(index, event)}
              />
              <button type="button" onClick={() => handleRemoveStep(index)}>
                Remove Step
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddStep}>
            Add Step
          </button>
        </div>
        <button type="submit">Create Task</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateTask;
