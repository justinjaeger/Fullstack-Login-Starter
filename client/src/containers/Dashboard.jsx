import React from 'react';

function Dashboard(props) { 
  const { username } = props;
  
  return (
    <>
      <div>Welcome, {username}</div>,
      <button onClick={logout} >Log Out</button>,
    </>
  );
}

export default Dashboard;
