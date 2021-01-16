import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Neutral from '../components/Neutral';
import Dashboard from '../components/Dashboard';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';

const LoginContainer = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("/");
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
      const un = decodeURIComponent(document.cookie.split('XXX')[1]);
      setRoute("/login");
      setUsername(un);
      setMessage("Email verified. Please enter your password");
    };

    if (document.cookie.includes('reset_password')) {
      const em = decodeURIComponent(document.cookie.split('XXX')[1]);
      setRoute("/resetPassword");
      setEmail(em);
      setMessage(`Please enter a new password for ${em}`);
    };

  }, [loggedIn]);

  // LOG USER IN
  function login(userData) {
    console.log('logging user in with this data: ', userData)
    setMessage();
    setUsername(userData.username);
    setLoggedIn(true);
    setRoute('/');
  };

  // LOG USER OUT
  function logout() {
    axios.get('/login/logout')
    .then(res => {
      console.log('logged user out successfully');
      setMessage();
      setLoggedIn(false);
      setUsername("");
    })
    .catch(err => {
      console.log('err, could not log out', err.response);
    })
  };

  // SET MESSAGE
  function notify(entry) {
    console.log('setting message:', entry)
    setMessage(entry);
  };

  // REDIRECT
  function redirect(entry) {
    console.log('redirecting', entry)
    setRoute(entry);
  };

  // X OUT
  function xout() {
    setMessage(false);
    setRoute('/');
  };

  // =============================== //
  
  return (
    <>
      { message && <div>{message}</div>}

      { (loggedIn===false && route === '/') &&
        <Neutral
          redirect={redirect}
        />
      }

      { (loggedIn===false && route === '/login') &&
        <Login 
          redirect={redirect}
          username={username}
          login={login}
          notify={notify}
          xout={xout}
        />
      }

      { (loggedIn===false && route === '/signup') &&
        <SignUp 
          redirect={redirect}
          notify={notify}
          xout={xout}
        />
      }

      { (loggedIn===false && route === '/forgotPassword') &&
        <ForgotPassword 
          redirect={redirect}
          notify={notify}
          xout={xout}
        />
      }

      { (loggedIn===false && route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          redirect={redirect}
          notify={notify}
          xout={xout}
          login={login}
        />
      }

      { (loggedIn===false && route === '/blank') && 
        <button onClick={() => xout()}>X</button>
      }

      { (loggedIn===true && route === '/') &&
        <Dashboard 
          username={username}
          logout={logout}
        />
      }

    </>
  );  
};

export default LoginContainer;
