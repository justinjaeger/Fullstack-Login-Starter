import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function ForgotPassword(props) {

  const { setMessage, setRoute, showXButton } = props;
  const [email, setEmail] = useState("");

  useEffect(() => {
    showXButton(true);
  });

  function validateForm() {
    return email.length > 0;
  };

  function handleSubmit(event) {

    const payload = { email };

    /* NOTE: The /signup POST request will send the user a verification email, so it won't return anything back except a message */
    
    axios.post('/login/forgotPassword', payload)
      .then(res => {
        console.log('got a response in forgotPassword')
        /* whether we get 202 (error message) or 200 (tells us to check email), we want to display the message */
        setMessage(res.data.message);
        if (res.status === 200) {
          setRoute('/blank');
        };
      })
      .catch(err => {
        console.log('err', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <div>Enter your email to reset your password</div>
      
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Email</div>
        <input
          className="login-form-input"
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setPassword(e.target.value)}
        /> 

        <button disabled={!validateForm()} className="submit-button">Submit</button>
        
      </form>
    </>
  );
};

export default ForgotPassword;
