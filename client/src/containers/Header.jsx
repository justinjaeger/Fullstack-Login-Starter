import React, { useEffect, useState } from 'react';

import LoggedIn from '../components/headerComponents/LoggedIn';;
import LoggedOut from '../components/headerComponents/LoggedOut';

function Header(props) { 

  const { 
    loggedIn,
    logout,
    setRoute, 
    username, 
    showLoginDropdown 
  } = props;

  useEffect(() => {
    console.log('header', loggedIn)
  });

  return (
    <div id="Header">

      { (loggedIn===false) &&
        <LoggedOut
          setRoute={setRoute}
          showLoginDropdown={showLoginDropdown}
        />
      }

      { (loggedIn===true) &&
        <LoggedIn 
          username={username}
          logout={logout}
        />
      }
      
    </div>
  );
}

export default Header;
