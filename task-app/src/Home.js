import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={() => navigate('/create-task')}>
        Create New Task
      </button>
    </div>
  );
};

export default Home;
