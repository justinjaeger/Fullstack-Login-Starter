import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './containers/Header';
import LoginContainer from './containers/LoginContainer';

function App() { 

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginDropdown, showLoginDropdown] = useState(true);
  const [loginRoute, setLoginRoute] = useState('/login');
  const [loginMessage, setLoginMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

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

    /* authenticated cookie exists affter we click the verification link in our email */
    if (document.cookie.includes('authenticated')) {
      const username = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/login");
      setUsername(username);
      setLoginMessage("Email verified. Please enter your password");
    };

    /* reset_password cookie exists after we click the reset password link in our email */
    if (document.cookie.includes('reset_password')) {
      const email = decodeURIComponent(document.cookie.split('XXX')[1]);
      setLoginRoute("/resetPassword");
      setEmail(email);
      setLoginMessage(`Please enter a new password for ${email}`);
    };

  }, [loggedIn]);

  // LOG IN
  function login(userData) {
    console.log('logging user in with this data: ', userData)
    setUsername(userData.username);
    setLoggedIn(true);
    showLoginDropdown(false);
    setLoginMessage('');
  };

  // LOG OUT
  function logout() {
    axios.get('/login/logout')
    .then(res => {
      console.log('logged user out successfully');
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

  return (
    <>
      <Header
        loggedIn={loggedIn}
        logout={logout}
        setRoute={setLoginRoute} 
        username ={username}
        showLoginDropdown={showLoginDropdown}
      />

      { (loginDropdown===true) && 
        <LoginContainer
          loggedIn={loggedIn} setLoggedIn={setLoggedIn}
          route={loginRoute} setRoute={setLoginRoute}
          username={username} setUsername={setUsername}
          email={email} setEmail={setEmail}
          message={loginMessage} setMessage={setLoginMessage}
          xOut={xOut}
          login={login}
        />
      }

    </>
  );
} 
 
export default App;
