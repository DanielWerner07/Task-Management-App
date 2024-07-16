// npm start to start
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import CreateTask from './CreateTask';
import AuthForm from './AuthForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App;
