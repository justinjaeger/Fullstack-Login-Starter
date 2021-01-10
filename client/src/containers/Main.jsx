import React from 'react';
import { useState, useEffect } from 'react';
import Component from '../components/Component';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import SignUp from './SignUp';

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // we want this to check automatically if the user is logged in
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

  // LOG OUT
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
  };
  
  return (
    <>
      {loggedIn && <div>Welcome, {username}</div>}
      {!loggedIn && <div>Welcome, please log in</div>}

      <div>{errorMessage}</div>

      <nav>
        {/* {!loggedIn && <div><Link to="/login">Log In</Link></div> }
        {!loggedIn && <div><Link to="/signup">Sign Up</Link></div> } */}
        {!loggedIn && <Login setError={setError} logUserIn={logUserIn} /> }
        {!loggedIn && <SignUp setError={setError} logUserIn={logUserIn} /> }
        {loggedIn && <button onClick={logout} >Log Out</button> }
      </nav>
    </>
  );  
};

export default Main;
