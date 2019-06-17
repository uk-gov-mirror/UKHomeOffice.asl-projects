import React from 'react';

const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'code':
      return <code {...attributes}>{children}</code>;
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    case 'superscript':
      return <sup {...attributes}>{children}</sup>;
    case 'subscript':
      return <sub {...attributes}>{children}</sub>;
    case 'comment':
      return <span className="comment" {...attributes}>{children}</span>;
    default:
      return next();
  }
};

export default renderMark;
