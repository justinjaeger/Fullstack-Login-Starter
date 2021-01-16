import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function SignUp(props) {

  const { notify, redirect, email, xout, login } = props;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
          notify(res.data.message);
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
      <button onClick={() => xout()}>X</button>
      
      <Form onSubmit={handleSubmit}>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group size="lg" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Reset Password
        </Button>
        
      </Form>

    </>
  );
};

export default SignUp;
