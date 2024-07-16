import React, { useState } from 'react';

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const [steps, setSteps] = useState(['']);

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleStepChange = (index, e) => {
    const newSteps = steps.slice();
    newSteps[index] = e.target.value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.slice();
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent
      body: JSON.stringify({ taskName, steps }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert('Error: ' + data.error);
        } else {
          alert('Task created successfully');
          // Optionally redirect or reset form
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Task Name:</label>
        <input type="text" value={taskName} onChange={handleTaskNameChange} required />
      </div>
      <div>
        <label>Steps:</label>
        {steps.map((step, index) => (
          <div key={index}>
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e)}
              required
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
  );
};

export default CreateTask;
