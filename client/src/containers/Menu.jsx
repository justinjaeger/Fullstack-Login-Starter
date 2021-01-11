import React from 'react';
import { useState, useEffect } from 'react';
import Component from '../components/Component';
import { Link, Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import SignUp from './SignUp';
import Neutral from './Neutral';

const Menu = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    // Checks if user is logged in
    console.log('useEffect');
    axios.get('/login/validate')
    .then(res => {
      console.log('res', res);
      const { username } = res.data;
      if (username) {
        setLoggedIn(true);
        setUsername(username);
      };
    })
    .catch(err => {
      console.log('err, could not validate', err.response);
    })
  }, [loggedIn])

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

  // LOG USER IN
  function logUserIn(userData) {
    console.log('logging user in with this data: ', userData)
    setUsername(userData.username);
    setErrorMessage(false);
    setLoggedIn(true);
  };

  // =============================== //
  
  return (
    <>
      { errorMessage && <div>ERROR: {errorMessage}</div>}

      { loggedIn
        ?
          [
            <Redirect to="/dashboard" />,
            <div>Welcome, {username}</div>,
            <button onClick={logout} >Log Out</button>,
          ]
        :
          [
            <Redirect to="/" />,
            <div>Log in or sign up</div>,
          ]
      }

      <Route exact path="/">
        <Neutral />
      </Route>
      <Route exact path="/login">
        <Login 
          setError={setError}
          logUserIn={logUserIn}
        />
      </Route>
      <Route exact path="/signup">
        <SignUp 
          setError={setError}
          logUserIn={logUserIn}
        />
      </Route>
    </>
  );  
};

export default Menu;
