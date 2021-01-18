import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function SignUp(props) {

  const { setMessage, setRoute, displayResendEmailLink, showXButton } = props;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    showXButton(true);
  });

  function validateForm() {
    return email.length > 0 && password.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      email,
      username,
      password,
      confirmPassword
    };

    console.log('submitted', payload);

    /* NOTE: The /signup POST request will send the user a verification email, so it won't return anything back except a message */
    
    axios.post('/signup', payload)
      .then(res => {
        /* whether we get 202 (error message) or 200 (tells us to check email), we want to display the message */
        setMessage(res.data.message);
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

        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
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
          Create Account
        </Button>
        
      </Form>

      <button onClick={() => setRoute('/login')}>Log In</button>
    </>
  );
};

export default SignUp;
