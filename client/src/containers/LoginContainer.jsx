import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Login from '../components/loginComponents/Login';
import SignUp from '../components/loginComponents/SignUp';
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
    error, setError,
    xOut,
    login
  } = props;

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

      { message && <div className="login-message">{message}</div>}

      <div id="login-form-container">
      { (route === '/login') &&
        <Login 
          setRoute={setRoute}
          username={username}
          login={login}
          setMessage={setMessage}
          setError={setError}
          displayResendEmailLink={displayResendEmailLink}
        />
      }

      { (route === '/signup') &&
        <SignUp 
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          displayResendEmailLink={displayResendEmailLink}
        />
      }

      { (route === '/forgotPassword') &&
        <ForgotPassword 
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
        />
      }

      { (route === '/resetPassword') &&
        <ResetPassword 
          email={email}
          setRoute={setRoute}
          setMessage={setMessage}
          setError={setError}
          login={login}
        />
      }

      { (route === '/blank') && 
        <Blank 
        />
      }
      </div>

      { error && <div className="error-message">{error}</div>}
      
      { resendEmailLink && <div className="login-message"><button onClick={() => {sendVerificationEmail(resendEmailLink.email, resendEmailLink.username)}} className="click-here-button" >Click here</button> to resend email</div> }

    </div>
  );  
};

export default LoginContainer;
