import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home';
import CreateTask from './CreateTask';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/" element={<AuthForm />} />
      </Routes>
    </Router>
  );
};

export default App;
