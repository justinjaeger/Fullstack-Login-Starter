import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, Switch, Route } from 'react-router-dom';
import axios from 'axios';

function Neutral() {

  return (
    <>
      <div><Link to="/login">Log In</Link></div>
      <div><Link to="/signup">Sign Up</Link></div>
    </>
  );
}

export default Neutral;
