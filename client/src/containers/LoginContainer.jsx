import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from '../components/loginComponents/Login';
import SignUp from '../components/loginComponents/SignUp';
// import Main from '../components/headerComponents/LoggedOut';
// import Dashboard from '../components/headerComponents/LoggedIn';
import ForgotPassword from '../components/loginComponents/ForgotPassword';
import ResetPassword from '../components/loginComponents/ResetPassword';
import Blank from '../components/loginComponents/Blank';

const LoginContainer = (props) => {

  const { 
    loggedIn, setLoggedIn,
    route, setRoute, 
    username, setUsername,
    email, setEmail,
    message, setMessage,
    xOut,
    login
  } = props;

  // const [loggedIn, setLoggedIn] = useState(false);
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [route, setRoute] = useState("/");
  // const [message, setMessage] = useState(false);
  // const [xButton, showXButton] = useState(false);
  const [resendEmailLink, displayResendEmailLink] = useState(false);

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

  // =============================== //
  
  return (
    <div id="login-container">

      <button onClick={() => xOut()} className="x-button">X</button>

      <div id="login-form-container">
      { (route === '/login') &&
        <Login 
          setRoute={setRoute}
          username={username}
          login={login}
          setMessage={setMessage}
          displayResendEmailLink={displayResendEmailLink}
        />
      }

      { (route === '/signup') &&
        <SignUp 
          setRoute={setRoute}
          setMessage={setMessage}
          displayResendEmailLink={displayResendEmailLink}
        />
      }

      { (route === '/forgotPassword') &&
        <ForgotPassword 
          setRoute={setRoute}
          setMessage={setMessage}
        />
      }

      { (route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          setRoute={setRoute}
          setMessage={setMessage}
          login={login}
        />
      }

      { (route === '/blank') && 
        <Blank 
        />
      }
      </div>

      { message && <div className="login-message">{message}</div>}
      
      { resendEmailLink && <div className="login-message"><button onClick={() => {sendVerificationEmail(resendEmailLink.email, resendEmailLink.username)}} className="secondary-button" >Click here</button> to resend email</div> }

    </div>
  );  
};

export default LoginContainer;
