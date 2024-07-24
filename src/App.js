// npm start to start
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home';
import CreateTask from './CreateTask';
import Account from './Account';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </Router>
  );
};

export default App;
