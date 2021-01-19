import React, { useEffect, useState } from "react";

function LoggedOut(props) {
  const { setRoute, showLoginDropdown } = props;

  function handleClick(route) {
    // Displays login dropdown and sets route
    showLoginDropdown(true);
    setRoute(route);
  };

  return (
    <>
      <button onClick={() => handleClick('/login')} className="header-button" >Log In</button>
      <button onClick={() => handleClick('/signup')} className="header-button">Sign Up</button>
    </>
  );
}

export default LoggedOut;
