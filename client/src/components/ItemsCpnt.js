import React, { Component } from 'react';
import './card.css';

class ListItemsCompnt extends Component {
  render() {
    const {
      title,
      description,
      ...props
    } = this.props;

    return (
      <div className="ToDoListItem"{...props}>
        <div className="ToDoListItem-title">{title}</div>
        <div className="ToDoListItem-description">{description}</div>
      </div>
    );
  }
}

export default ListItemsCompnt;