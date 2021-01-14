import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function SignUp(props) {
  const { logUserIn } = props;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

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

    axios.post('/signup', payload)
      .then(res => {
        // sends 202 with message when error occurs
        if (res.status === 202) {
          setError(res.data.message);
        } else {
          logUserIn(res.data); // log user in & send user data
        };
      })
      .catch(err => {
        console.log('err', err.response);
      })

    event.preventDefault(); /** prevents it from refreshing */
  };

  return (
    <>
      <button><Link to="/">X</Link></button>
      
      { error && <div>ERROR: {error}</div>}

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

      <div><Link to="/login">Log In</Link></div>
    </>
  );
}

export default SignUp;
