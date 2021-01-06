import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Login from './views/Login';
import SignUp from './views/SignUp';
import Dashboard from './views/Dashboard';

function Routes() { 
  console.log('this is App.js');
  return (
    <Switch>
      <Route path='/login' component={Login} />
    </Switch>
  );
}

export default Routes;