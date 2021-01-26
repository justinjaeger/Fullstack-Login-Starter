import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './containers/Header';
import LoginContainer from './containers/LoginContainer';

function App() { 

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginDropdown, showLoginDropdown] = useState(false);
  const [loginRoute, setLoginRoute] = useState('/');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // console.log('useEffect firing');
    /* Checks if user is logged in. If so, it populates the page with user data */
    axios.get('/login/verifyUserAndReturnUserId')
      .then(res => {
        const { username } = res.data;
        if (username) {
          setLoggedIn(true);
          setUsername(username);
        };
      })
      .catch(err => {
        console.log('err, could not validate', err.response);
      })

    /* authenticated cookie exists affter we click the verification link in our email */
    if (document.cookie.includes('authenticated')) {
      const username = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/login");
      showLoginDropdown(true);
      setUsername(username);
      setLoginMessage("Email verified. Please enter your password");
    };

    /* reset_password cookie exists after we click the reset password link in our email */
    if (document.cookie.includes('reset_password')) {
      const email = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/resetPassword");
      showLoginDropdown(true);
      setEmail(email);
      setLoginMessage(`Please enter a new password for ${email}`);
    };

  }, [loggedIn]);

  // LOG IN
  function login(userData) {
    setUsername(userData.username);
    setLoggedIn(true);
    showLoginDropdown(false);
    setLoginMessage('');
  };

  // LOG OUT
  function logout() {
    axios.get('/login/logout')
    .then(res => {
      setLoggedIn(false);
      setUsername('');
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // X OUT
  function xOut() {
    showLoginDropdown(false);
    setLoginMessage('');
  };

  // REROUTE (has to be its own function cause error messages need to be deleted)
  function redirect(entry) {
    setLoginRoute(entry);
    setLoginError('');
    setLoginMessage('');
  };

  return (
    <div id="App">
      <Header
        loggedIn={loggedIn}
        logout={logout}
        setRoute={redirect} 
        username ={username}
        showLoginDropdown={showLoginDropdown}
      />

      { (loginDropdown===true) && 
        <LoginContainer
          loggedIn={loggedIn} setLoggedIn={setLoggedIn}
          route={loginRoute} setRoute={redirect}
          username={username} setUsername={setUsername}
          email={email} setEmail={setEmail}
          message={loginMessage} setMessage={setLoginMessage}
          error={loginError} setError={setLoginError}
          xOut={xOut}
          login={login}
        />
      }
    </div>
  );
} 
 
export default App;
