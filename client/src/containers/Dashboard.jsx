import React, { useEffect } from 'react';

function Dashboard(props) { 
  const { username, logout } = props;

  useEffect(() => {
    console.log('props: ', username, logout);
  });

  return (
    <>
      <div>Welcome, {username}</div>
      <button onClick={logout} >Log Out</button>
    </>
  );
}

export default Dashboard;
