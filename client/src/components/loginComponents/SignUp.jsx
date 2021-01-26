import React, { useState, useEffect } from "react";
import axios from 'axios';

function SignUp(props) {

  const { setMessage, setRoute, setError, displayResendEmailLink } = props;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validateForm() {
    return username.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      email,
      username,
      password,
      confirmPassword
    };

    /* NOTE: The /signup POST request will send the user a verification email, so it won't return anything back except a message */
    axios.post('/signup', payload)
      .then(res => {
        /* whether we get 202 (error message) or 200 (tells us to check email), we want to display the message */
        if (res.data.message) setMessage(res.data.message);
        if (res.data.error) setError(res.data.error);
        
        if (res.status === 200) {
          setRoute('/blank');
          displayResendEmailLink({ email, username });
        };
      })
      .catch(err => {
        console.log('error in signup', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Email</div>
        <input
          className="login-form-input"
          autoFocus
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)} /* so it actually updates visually when you type */
        />

        <div className="login-form-label">Username</div>          
        <input
          className="login-form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="login-form-label">Password</div>          
        <input
          className="login-form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-form-label">Confirm Password</div>          
        <input
          className="login-form-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button disabled={!validateForm()} className="submit-button">Create Account</button>

      </form> 
    </>
  );
};

export default SignUp;
