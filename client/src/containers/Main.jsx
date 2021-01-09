import React from 'react';
import Component from '../components/Component';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';


const Main = () => (
  <>
    Welcome to the website
    <nav>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/signup">SignUp</Link>
        </div>
    </nav>
  </>
);

export default Main;
