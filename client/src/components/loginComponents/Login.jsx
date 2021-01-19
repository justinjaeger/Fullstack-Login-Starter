import React, { useState, useEffect } from "react";
import axios from 'axios';

function Login(props) {

  const { login, setMessage, setError, username, setRoute, displayResendEmailLink } = props;
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (username) setEmailOrUsername(username);
  });

  function validateForm() {
    return emailOrUsername.length > 0 && password.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      emailOrUsername,
      password,
    };

    console.log('submitted payload: ', payload);

    axios.post('/login', payload)
      .then(res => {
        /* when something about the input is wrong, server sends 202 with message */
        if (res.status === 202) {
          if (res.data.message) setMessage(res.data.message);
          if (res.data.error) setError(res.data.error);
          if (res.data.email) {
            displayResendEmailLink({ email: res.data.email, username: res.data.username });
            setRoute('/blank');
          };
        } else if (res.status === 200) {
          console.log('logged user in successfully');
          login(res.data); /* log user in & send user data */
        };
      })
      .catch(err => {
        console.log('something broke trying to log user in', err.response);
      })

    event.preventDefault(); /** prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Email or Username</div>
        <input
          className="login-form-input"
          autoFocus
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />

        <div className="login-form-label">Password</div>
        <input
          className="login-form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />  
        
        <button disabled={!validateForm()} className="submit-button" >Submit</button>
        
        <button onClick={() => setRoute('/forgotPassword')} className="forgot-password-button">Forgot your password?</button>
      
      </form>
    </>
  );
}

export default Login;
