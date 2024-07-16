import React, { useState } from 'react';

const CreateTask = () => {
  const [task, setTask] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add code to handle task creation, e.g., sending task data to the backend
    console.log('Task created:', task);
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
