import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, Switch, Route } from 'react-router-dom';

function Login(props) {
  console.log('shit');
  // const { setError, logUserIn } = props;
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  console.log('props', props)

  function validateForm() {
    return emailOrUsername.length > 0 && password.length > 0;
  };

  function handleSubmit(event) {
    const payload = {
      emailOrUsername,
      password,
    };
    console.log('submitted this in login:', payload);

    axios.get('/login', payload)
      .then(res => {
        // sends 202 with message when error occurs
        if (res.status === 202) {
          setError(res.data.message); // send error message
        } else {
          setError(""); // reset error message
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
    </>
  );
}

export default Login;
