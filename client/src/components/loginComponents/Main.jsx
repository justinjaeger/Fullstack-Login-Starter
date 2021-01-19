import React, { useState } from "react";

function Main(props) {
  const { setRoute } = props;

  return (
    <>
      <div>Log in or sign up</div>
      <button onClick={() => setRoute('/login')} className="primary-button" >Log In</button>
      <button onClick={() => setRoute('/signup')} className="primary-button">Sign Up</button>
    </>
  );
}

export default Main;
