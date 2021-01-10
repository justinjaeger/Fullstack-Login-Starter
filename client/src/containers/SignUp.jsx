import React, { useState } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from 'axios';

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [myUsername, setMyUsername] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

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
          setErrorMessage(res.data.message);
        }
        else {
          setErrorMessage(""); // reset error message
          // log user in
          setLoggedIn(true);
        }
        // res.data has all the user info
        const { username } = res.data;
        setMyUsername(username);
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err.response);
      })

    event.preventDefault(); /** prevents it from refreshing */
  }

  return (
    <>
    {loggedIn && 
      <div>Welcome, {myUsername}</div>
    }
    <div className="signup">
      <Form onSubmit={handleSubmit}>

        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
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
    </div>

    <div>{errorMessage}</div>

    <Link to="/login">Login</Link>
    </>
  );
}

export default SignUp;
