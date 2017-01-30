import React from 'react';
import ReactDOM from 'react-dom';
import AppContext from './App.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('root');
  ReactDOM.render(<AppContext />, rootEl);
});
