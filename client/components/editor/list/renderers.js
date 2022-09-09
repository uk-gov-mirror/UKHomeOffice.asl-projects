import React from 'react';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, readOnly } = props;
  const isCurrentItem = !readOnly && editor.getItemsAtRange().contains(node);

  switch (node.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return (
        <li
          className={isCurrentItem ? 'current-item' : ''}
          title={isCurrentItem ? 'Current Item' : ''}
          {...props.attributes}
        >
          {props.children}
        </li>
      );
    default:
      return next();
  }
};

export default renderBlock;
