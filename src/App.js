import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AuthForm from './AuthForm';
import Register from './Register';
import CreateTask from './CreateTask';
import withAuth from './withAuth';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={withAuth(Home)} />
        <Route path="/create-task" element={withAuth(CreateTask)} />
      </Routes>
    </Router>
  );
};

export default App;
