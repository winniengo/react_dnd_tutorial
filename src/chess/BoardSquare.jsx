import React, { Component, PropTypes } from 'react';
import Square from './Square.jsx';
import { canMoveKnight, moveKnight } from './Game.js';
import { ItemTypes } from './Constants.js';
import { DropTarget } from 'react-dnd';

// ItemTypes.KNIGHT => 'type'

const squareTarget = {
  drop: function(props, monitor) {
    moveKnight(props.x, props.y);
  }
}; // => 'spec'

function collect(connect, monitor) { // => 'collect'
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class BoardSquare extends Component {
  render() {
    const { x, y, connectDropTarget, isOver } = this.props;
    const black = (x + y) % 2 === 1;

    return connectDropTarget(
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {isOver &&
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'yellow',
          }} />
        }
      </div>
    );
  }
}

BoardSquare.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare);
