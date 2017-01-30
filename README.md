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

#### Write the drag source.

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

The [DragSource](http://react-dnd.github.io/react-dnd/docs-drag-source.html) is a higher-order component that accepts three parameters:
+ `type`,
+ `spec`,
+ and `collect`.

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
