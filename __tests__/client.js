import { isType } from 'graphql';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../client/src/App';
/**
 * Documentation: 
 * React testing library https://github.com/testing-library/react-testing-library#the-problem
 * https://www.youtube.com/watch?v=3e1GHCA3GP0
 * Jest https://jestjs.io/docs/en/expect
*/

it('renders App without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
})