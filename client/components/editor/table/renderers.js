import React from 'react';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;
  switch (node.type) {
    case 'table':
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr { ...attributes }>{ children }</tr>
    case 'table-cell':
      return (
        <td
          colSpan={node.get('data').get('colSpan')}
          rowSpan={node.get('data').get('rowSpan')}
          {...attributes}
        >
          {children}
        </td>
      );
    default:
      return next()
  }
}

export default renderBlock;
