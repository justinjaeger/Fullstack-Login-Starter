import React from 'react';
import { useState, useEffect } from 'react';
import { Link, Switch, Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import SignUp from './SignUp';
import Neutral from './Neutral';
import Dashboard from './Dashboard';

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    /**
     * Checks if user is logged in
     * Returns all user data except password
    */
    console.log('In useEffect');
    axios.get('/login/getUserId')
    .then(res => {
      console.log('Res:', res.data);
      const { username } = res.data;
      if (username) {
        setLoggedIn(true);
        setUsername(username);
      };
    })
    .catch(err => {
      console.log('err, could not validate', err.response);
    })
  }, [loggedIn]);

  // LOG USER IN
  function logUserIn(userData) {
    console.log('logging user in with this data: ', userData)
    setUsername(userData.username);
    setErrorMessage(false);
    setLoggedIn(true);
  };

  // LOG USER OUT
  function logout() {
    axios.get('/login/logout')
    .then(res => {
      console.log('res', res);
      setLoggedIn(false);
      setUsername("");
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // SET ERROR MESSAGE
  function setError(message) {
    console.log('setting error message');
    setErrorMessage(message);
  };

  // =============================== //
  
  return (
    <>
      {/* { errorMessage && <div>ERROR: {errorMessage}</div>} */}

      { loggedIn===false
      ?
        [
        <Redirect to="/"/>,
        
        <Switch>
          <Route exact path="/">
            <Neutral />
          </Route>
          <Route exact path="/login">
            <Login 
              logUserIn={logUserIn}
            />
          </Route>
          <Route exact path="/signup">
            <SignUp 
              logUserIn={logUserIn}
            />
          </Route>
        </Switch>
        ]

      :
        [ 
          <Redirect to="dashboard"/>,

          <Route exact path="/dashboard">
            <Dashboard 
              username={username}
              logout={logout}
            />
          </Route>
        ]
      }
    </>
  );  
};

export default Main;
