import React, { useState } from "react";

function Main(props) {
  const { setRoute } = props;

  return (
    <>
      <div>Log in or sign up</div>
      <button onClick={() => setRoute('/login')}>Log In</button>
      <button onClick={() => setRoute('/signup')}>Sign Up</button>
    </>
  );
}

export default Main;
