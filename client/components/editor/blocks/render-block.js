import React from 'react';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, isFocused } = props;
  switch (node.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'image': {
      const src = node.data.get('src');
      return <img src={src} {...attributes} selected={isFocused} />;
    }
    case 'block': {
      return <span {...attributes}>{children}</span>
    }
    default:
      return next();
  }
};

export default renderBlock;
