import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Header from './containers/Header';
import Footer from './containers/Footer';
import Body from './containers/Body';

function App() { 
  console.log('this is App.js');
  return (
    <>
      <Router>
        <Header/>
        <Body/>
        <Footer/>
      </Router>
    </>
  );
} 
 
export default App;
