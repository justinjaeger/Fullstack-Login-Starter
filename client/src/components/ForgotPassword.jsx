import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function ForgotPassword(props) {

  const { notify, redirect, xout } = props;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        notify(res.data.message);
        if (res.status === 200) {
          redirect('/blank');
        };
      })
      .catch(err => {
        console.log('err', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <button onClick={() => xout()}>X</button>

      <div>Enter your email to reset your password</div>
      
      <Form onSubmit={handleSubmit}>

        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} /* so it actually updates visually when you type */
          />
        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Submit
        </Button>
        
      </Form>

    </>
  );
};

export default ForgotPassword;
