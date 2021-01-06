import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import history from './services/history';
import Login from './views/Login';
import Main from './containers/Main';

function App() { 
  console.log('this is App.js');
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  );
} 
 
export default App;
