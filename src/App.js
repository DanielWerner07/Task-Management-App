// npm start to start
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home';
import CreateTask from './CreateTask';
import withAuth from './withAuth';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={withAuth(Home)} />
        <Route path="/create-task" element={withAuth(CreateTask)} />
      </Routes>
    </Router>
  );
};

export default App;
