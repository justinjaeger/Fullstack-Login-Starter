import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

/* NO SSR */
// ReactDOM.render(
//   <React.StrictMode>
//     <App/>
//   </React.StrictMode>,
//   document.getElementById('root'),
// );

ReactDOM.hydrate(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root'),
);
