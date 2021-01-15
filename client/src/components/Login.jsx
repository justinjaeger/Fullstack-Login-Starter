import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login(props) {

  const { login, notify, username } = props;
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
          notify(res.data.message);
        } else {
          console.log('logged user in successfully');
          login(res.data); // log user in & send user data
        };
      })
      .catch(err => {
        console.log('something broke - did not log user in', err.response);
      })

    event.preventDefault(); /** prevents it from refreshing */
  };

  return (
    <>
      <button><Link to="/">X</Link></button>

      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="emailOrUsername">
          <Form.Label>Email or Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>

      <div><Link to="/signup">Sign Up</Link></div>
    </>
  );
}

export default Login;
