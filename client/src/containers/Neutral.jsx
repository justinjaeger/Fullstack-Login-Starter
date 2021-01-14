import React, { useState } from "react";
import { Link, Switch, Route } from 'react-router-dom';

function Neutral() {

  return (
    <>
      <div>Log in or sign up</div>
      <div><Link to="/login">Log In</Link></div>
      <div><Link to="/signup">Sign Up</Link></div>
    </>
  );
}

export default Neutral;
