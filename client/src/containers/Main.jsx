import React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { Link, Switch, Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import SignUp from './SignUp';
import Neutral from './Neutral';
import Dashboard from './Dashboard';

const Main = () => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [route, setRoute] = useState("/"); // home, login, signup
  const [message, setMessage] = useState(false);

  useEffect(() => {
    /**
     * Checks for cookies
     * If user is logged in, it finds the user_id to populate the page with
     * If not logged in, check if the user just authenticated their email
    */
    console.log('useEffect firing');
    console.log('currentRoute', route);
    if (message) setMessage(message);
    // check for "access_token" cookie
    if (document.cookie.includes('access_token')) {
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
    // if no access_token, check for "authenticated" cookie, which exists after user validates email
    } else if (document.cookie.includes('authenticated')) {
      const un = document.cookie.split('XXX')[1];
      setUsername(un);
      setRoute("/login");
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
      console.log('res', res);
      setLoggedIn(false);
      setUsername("");
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // REDIRECT
  function redirect(routeEntry, messageEntry) {
    console.log('setting Route: ', routeEntry)
    setRoute(routeEntry);
    if (messageEntry) setMessage(messageEntry);
    // needs to force a refresh so it's immediate
    console.log('forcing update')
    forceUpdate();
  };

  // SET MESSAGE
  function notify(entry) {
    setMessage(entry);
    forceUpdate();
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
              redirect={redirect}
              notify={notify}
            />
          </Route>
          <Route exact path="/signup">
            <SignUp 
              redirect={redirect}
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
