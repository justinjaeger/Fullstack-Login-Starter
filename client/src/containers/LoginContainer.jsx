import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from '../components/loginComponents/Login';
import SignUp from '../components/loginComponents/SignUp';
import Main from '../components/loginComponents/Main';
import Dashboard from '../components/loginComponents/Dashboard';
import ForgotPassword from '../components/loginComponents/ForgotPassword';
import ResetPassword from '../components/loginComponents/ResetPassword';
import Blank from '../components/loginComponents/Blank';

const LoginContainer = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("/");
  const [message, setMessage] = useState(false);
  const [xButton, showXButton] = useState(false);
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

    /* authenticated cookie exists affter we click the verification link in our email */
    if (document.cookie.includes('authenticated')) {
      const username = decodeURIComponent(document.cookie.split('XXX')[1]);
      setRoute("/login");
      setUsername(username);
      setMessage("Email verified. Please enter your password");
    };

    /* reset_password cookie exists after we click the reset password link in our email */
    if (document.cookie.includes('reset_password')) {
      const email = decodeURIComponent(document.cookie.split('XXX')[1]);
      setRoute("/resetPassword");
      setEmail(email);
      setMessage(`Please enter a new password for ${email}`);
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

  // RESEND VERIFICATION EMAIL
  function sendVerificationEmail(email, username) {
    const payload = { email, username };
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

  // X OUT
  function xOut() {
    setMessage(false);
    setRoute('/');
    displayResendEmailLink(false);
    showXButton(false);
  };

  // =============================== //
  
  return (
    <>
      { xButton && <button onClick={() => xOut()}>X</button> }
      { message && <div>{message}</div>}
      { resendEmailLink && <div><button onClick={() => {sendVerificationEmail(resendEmailLink.email, resendEmailLink.username)}} >Click here</button> to resend email</div> }

      { (loggedIn===false && route === '/') &&
        <Main
          setRoute={setRoute}
          showXButton={showXButton}
        />
      }

      { (loggedIn===false && route === '/login') &&
        <Login 
          setRoute={setRoute}
          username={username}
          login={login}
          setMessage={setMessage}
          displayResendEmailLink={displayResendEmailLink}
          showXButton={showXButton}
        />
      }

      { (loggedIn===false && route === '/signup') &&
        <SignUp 
          setRoute={setRoute}
          setMessage={setMessage}
          showXButton={showXButton}
          displayResendEmailLink={displayResendEmailLink}
        />
      }

      { (loggedIn===false && route === '/forgotPassword') &&
        <ForgotPassword 
          setRoute={setRoute}
          setMessage={setMessage}
          showXButton={showXButton}
        />
      }

      { (loggedIn===false && route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          setRoute={setRoute}
          setMessage={setMessage}
          login={login}
          showXButton={showXButton}
        />
      }

      { (loggedIn===false && route === '/blank') && 
        <Blank 
          showXButton={showXButton}
        />
      }

      { (loggedIn===true && route === '/') &&
        <Dashboard 
          username={username}
          logout={logout}
          showXButton={showXButton}
        />
      }

    </>
  );  
};

export default LoginContainer;
