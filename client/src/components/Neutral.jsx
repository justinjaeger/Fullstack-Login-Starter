import React, { useState } from "react";

function Neutral(props) {
  const { redirect } = props;

  return (
    <>
      <div>Log in or sign up</div>
      <button onClick={() => redirect('/login')}>Log In</button>
      <button onClick={() => redirect('/signup')}>Sign Up</button>
    </>
  );
}

export default Neutral;
