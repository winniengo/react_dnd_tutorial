import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants.js';
import { merge } from 'lodash';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class Card extends Component {
  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = {opacity: isDragging ? 0 : 1};

    return connectDropTarget(connectDragSource(
      <div style={merge({}, style, opacity)}>
        {text}
      </div>
    ));
  }
};

// Card.propTypes = {
//   connectDragSource: PropTypes.func.isRequired,
//   connectDropTarget: PropTypes.func.isRequired,
//   index: PropTypes.number.isRequired,
//   isDragging: PropTypes.bool.isRequired,
//   id: PropTypes.any.isRequired,
//   text: PropTypes.string.isRequired,
//   moveCard: PropTypes.func.isRequired,
// };

// export default DropTarget(ItemTypes.CARD, cardTarget, connect => ({

export default DropTarget(ItemTypes.CARD, cardTarget, collectTarget)(
  DragSource(ItemTypes.CARD, cardSource, collectSource)(Card));
