Walkthrough of [React DnD Tutorial](http://react-dnd.github.io/react-dnd/docs-tutorial.html)!

Goal: build a tiny app with a Chess board and a lonely draggable Knight.

Topics covered:

+ data-driven approach of React DnD
+ create a drag source and drop target
+ write them together with React components
+ change their appearance in response to drag and drop events

## Components

`Knight`
`Square`
`Board`

## Adding the Drag and Drop Interaction

### Overview
+ the backends
+ the collecting functions
+ the types
+ the items
+ the drag sources,
+ and the drop targets

### Getting Started

Install React DnD and its HTML5 backend.

```
npm install --save react-dnd react-dnd-html5-backend
```

Setup `DragDropContext` at top-level component of app (eg. `Board`) and specify use of [HTML5 backend](http://react-dnd.github.io/react-dnd/docs-html5-backend.html).

```js
import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Board extends Component {
  /* ... */
}

export default DragDropContext(HTML5Backend)(Board);
```

Create the constants for the draggable item types. Create a `Constants` module that exports draggable item types.

For example,
```js
export const ItemTypes = {
  KNIGHT: 'knight'
};
```

### Make your component draggable!

The [DragSource](http://react-dnd.github.io/react-dnd/docs-drag-source.html) is a higher-order component that makes your components draggable. It accepts three parameters:
+ `type`,
+ `spec`,
+ and `collect`.

#### Write the drag source specification.

For the `Knight`, the drag source specification is going to be simple because there is only a single draggable object in the whole application.

```js
const knightSource = {
  beginDrag(props) {
    return {};
  }
};
```

#### Write the collection function.
What props does the draggable component need?

For example, the `Knight` will need a way to specify the drag source node. It would also be nice to slightly dim the Knight's opacity while it is being dragged. Therefore, it needs to know whether it is currently being dragged.

```js
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
```

#### Wrap your component with `DragSource` to make it draggable.

Making `Knight` a drag source.

```js
import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';

// ItemTypes.KNIGHT => `type`

const knightSource = { // => 'spec'
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) { // => `collect`
  return {
    connectDragSource: connect.dragSource(), // passed a `props` to wrapped component
    isDragging: monitor.isDragging()
  }
}

class Knight extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move'
      }}>
        ♘
      </div>
    );
  }
}

Knight.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight);
```

### Handle your dropped component!
by making your components drop targets...

Create a new _smart_ component called the `BoardSquare`. It renders a `Square`, but is also aware of its position. Update `Board` to use it.

The [`DropTarget`](http://react-dnd.github.io/react-dnd/docs-drop-target.html) is a higher-order component that makes wrapped components react to the compatible items being dragged, hovered, or dropped on it. Like `DragSource`, it accepts three parameters:
+ `type`,
+ `spec`,
+ and `collect`.

#### Write the drop target specification.

For example,

```js
const squareTarget = {
  drop(props, monitor) {
    moveKnight(props.x, props.y);
  }
};
```

The `drop` method receives the props of the BoardSquare so it knows where to move the knight when it drops. In a real app, I might also use `monitor.getItem()` to retrieve the dragged item that the drag source returned from `beginDrag`.

#### Write the collection function.

```js
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}
```

#### Wrap your component with a `DropTarget`.

Making `BoardSquare` a drop target.

```js
import React, { Component, PropTypes } from 'react';
import Square from './Square';
import { canMoveKnight, moveKnight } from './Game';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const squareTarget = {
  drop(props) {
    moveKnight(props.x, props.y);
  }
};

function collect(connect, monitor) {
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
```
