import React from 'react';
import { useState, useEffect } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import axios from 'axios';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Neutral from '../components/Neutral';
import Dashboard from '../components/Dashboard';

const Main = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [route, setRoute] = useState("/"); // home, login, signup - 
  const [message, setMessage] = useState(false);

  useEffect(() => {
    console.log('useEffect firing');
    /**
     * Checks if user is logged in
     * If user is logged in, it finds the user_id to populate the page with
     * If not logged in, check if the user just authenticated their email
    */
    axios.get('/login/verifyUserAndReturnUserId')
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

    /* Authenticated cookie exists affter we click the verification link in our email */
    if (document.cookie.includes('authenticated')) {
      /** 
       * This does 3 things:
       * 1. Route user to /login
       *    - this setRoute() works since it's a new page we got linked to, but would not work normally
       *    - it also kind of locks you into this page, since it redirects you to login every refresh. not great
       * 2. The cookie stores the username, so we make that the input for them
       * 3. And we send the message that tells them to enter password
       * Overall, this is quite a bad solution but I'll fix it later
       */
      const un = document.cookie.split('XXX')[1];
      setRoute("/login");
      setUsername(un);
      setMessage("Email verified. Please enter your password");
    };
  }, [loggedIn]);

  // LOG USER IN
  function login(userData) {
    console.log('logging user in with this data: ', userData)
    setMessage("");
    setUsername(userData.username);
    setLoggedIn(true);
  };

  // LOG USER OUT
  function logout() {
    axios.get('/login/logout')
    .then(res => {
      console.log('logged user out successfully');
      setMessage("");
      setLoggedIn(false);
      setUsername("");
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // SET MESSAGE
  function notify(entry) {
    setMessage(entry);
  };

  // =============================== //
  
  return (
    <>
      { message && <div>{message}</div>}

      { loggedIn===false
      ?
        [
        <Redirect to={route}/>,
        <Switch>
          <Route exact path="/">
            <Neutral />
          </Route>
          <Route exact path="/login">
            <Login 
              username={username}
              login={login}
              notify={notify}
            />
          </Route>
          <Route exact path="/signup">
            <SignUp 
              notify={notify}
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
