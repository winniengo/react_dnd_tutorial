import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.jsx';
import { observe } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('root');

  observe(knightPosition =>
    ReactDOM.render(
      <Board knightPosition={knightPosition} />,
      rootEl
    )
  );

});
