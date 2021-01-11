import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Menu from './containers/Menu';

function App() { 
  console.log('this is App.js');
  return (
    <>
      <Router>
        <Menu/>
      </Router>
    </>
  );
} 
 
export default App;
