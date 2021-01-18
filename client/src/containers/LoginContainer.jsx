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
  const [resendEmailLink, displayResendEmailLink] = useState(false);

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

  // DISPLAY EMAIL RESEND LINK
  function display(em, un) {
    console.log('showing email resend link')
    displayResendEmailLink({ em, un });
  };

  // SEND VERIFICATION EMAIL
  function sendVerificationEmail(em, un) {
    const payload = { email: em, username: un };
    axios.post('/signup/resend-verification', payload)
    .then(res => {
      console.log('resent verification email successfully');
      setRoute('/blank');
      setMessage(res.data.message);
      displayResendEmailLink(false);
    })
    .catch(err => {
      console.log('err, could not resend verification email', err.response);
    })
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
    displayResendEmailLink(false)
  };

  // =============================== //
  
  return (
    <>
      { message && <div>{message}</div>}
      { resendEmailLink && <div><button onClick={() => {sendVerificationEmail(resendEmailLink.em, resendEmailLink.un)}} >Click here</button> to resend email</div> }

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
          display={display}
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
