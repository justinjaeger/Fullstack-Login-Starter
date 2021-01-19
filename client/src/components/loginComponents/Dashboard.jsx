import React, { useEffect } from 'react';

function Dashboard(props) { 
  const { username, logout, showXButton } = props;

  useEffect(() => {
    showXButton(false);
  });

  return (
    <>
      <div>Welcome, {username}</div>
      <button onClick={logout} className="primary-button" >Log Out</button>
    </>
  );
}

export default Dashboard;
