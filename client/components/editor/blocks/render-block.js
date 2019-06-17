import React from 'react';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, isFocused } = props;
  switch (node.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'image': {
      const src = node.data.get('src');
      return <img src={src} {...attributes} selected={isFocused} />;
    }
    default:
      return next();
  }
};

export default renderBlock;
