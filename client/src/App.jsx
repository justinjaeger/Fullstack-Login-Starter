import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Main from './containers/Main';

function App() { 
  console.log('Rendering App.js');
  return (
    <>
      <Router>
        <Main/>
      </Router>
    </>
  );
} 
 
export default App;
