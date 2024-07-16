import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home'; // Assuming you have a Home component

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/" component={AuthForm} />
      </Switch>
    </Router>
  );
};

export default App;
