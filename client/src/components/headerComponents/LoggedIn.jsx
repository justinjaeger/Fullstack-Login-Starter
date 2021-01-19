import React, { useEffect } from 'react';

function LoggedIn(props) { 
  const { username, logout } = props;

  useEffect(() => {
    console.log('logged in')
  });

  console.log('login')

  return (
    <>
      <div id="header-message">Welcome, {username}</div>
      <button onClick={logout} className="header-button" >Log Out</button>
    </>
  );
}

export default LoggedIn;
