import React from 'react';
import { OverflowWrapper } from '@asl/components';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, readOnly } = props;
  switch (node.type) {
    case 'table':
      if (readOnly) {
        return (
          <div className="force-show-scrollbars">
            <OverflowWrapper>
              <table {...attributes}>
                <tbody>{children}</tbody>
              </table>
            </OverflowWrapper>
          </div>
        );
      }
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr { ...attributes }>{ children }</tr>;
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
      return next();
  }
};

export default renderBlock;
