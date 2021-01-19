import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function SignUp(props) {

  const { setMessage, setRoute, email, showXButton, login } = props;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    showXButton(true);
  });

  function validateForm() {
    return password.length > 0 && confirmPassword.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      emailOrUsername: email,
      password,
      confirmPassword
    };

    console.log('submitted', payload);

    /* NOTE: The /signup POST request will send the user a verification email, so it won't return anything back except a message */
    
    axios.post('/login/changePasswordAndLogin', payload)
      .then(res => {
        /* when something about the input is wrong, server sends 202 with message */
        if (res.status === 202) {
          setMessage(res.data.message);
        } else if (res.status === 200) {
          console.log('logged user in successfully', res.data);
          login(res.data); // log user in & send user data
        };
      })
      .catch(err => {
        console.log('something broke - did not log user in after changing password', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Password</div>
        <input
          className="login-form-input"
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-form-label">Confirm Password</div>
        <input
          className="login-form-input"
          autoFocus
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button disabled={!validateForm()} className="submit-button" >Reset Password</button>
        
      </form>
    </>
  );
};

export default SignUp;
