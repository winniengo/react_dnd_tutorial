import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Chess from './chess/Chess.jsx';
import Sortable from './sortable/Sortable.jsx';

const App = () => (
  <div>
    <Chess />
    <Sortable />
  </div>
);

export default DragDropContext(HTML5Backend)(App);
