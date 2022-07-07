import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

function Image(props) {
  return (
    <div className="image-wrapper">
      <div className="image-overlay">
        <Button onClick={props.remove} className="button-warning">Remove image</Button>
      </div>
      <p>{ props.loading ? 'Saving image...' : <img {...props} /> }</p>
    </div>
  )
}

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, isFocused } = props;

  if (!['image', 'table-cell'].includes(node.type) && props.readOnly && !node.text.trim().length) {
    return null;
  }

  function remove() {
    editor.removeNodeByKey(node.key);
  }

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
      const loading = node.data.get('loading');
      return <Image src={src} loading={loading} {...attributes} selected={isFocused} remove={remove} />
    }
    case 'block': {
      return <span {...attributes}>{children}</span>
    }
    default:
      return next();
  }
};

export default renderBlock;
