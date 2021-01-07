import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Main from './Main';
import Login from './Login';
import SignUp from './SignUp';

function Body() { 

  return (
    <Route>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
      </Switch>
    </Route>
  );
} 
 
export default Body;
