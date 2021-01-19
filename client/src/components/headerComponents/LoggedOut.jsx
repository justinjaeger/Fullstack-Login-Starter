import React, { useEffect, useState } from "react";

function LoggedOut(props) {
  const { setRoute, showLoginDropdown } = props;

  useEffect(() => {
    console.log('logged out')
  });

  function handleClick(route) {
    // Displays login dropdown and sets route
    showLoginDropdown(true);
    setRoute(route);
  };

  return (
    <>
      <button onClick={() => handleClick('/login')} className="primary-button" >Log In</button>
      <button onClick={() => handleClick('/signup')} className="primary-button">Sign Up</button>
    </>
  );
}

export default LoggedOut;
