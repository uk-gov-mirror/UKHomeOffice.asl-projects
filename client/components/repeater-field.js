import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import isFunction from 'lodash/isFunction';
import Repeater from './repeater';
import Fieldset from './fieldset';

export function Item({
  index,
  fields,
  values,
  updateItem,
  removeItem,
  length,
  prefix,
  singular,
  confirmRemove,
  noComments
}) {
  const project = useSelector(state => state.project);

  function confirmRemoveItem(e) {
    e.preventDefault();
    if (isFunction(confirmRemove)) {
      if (confirmRemove(project, values)) {
        return removeItem(e);
      }
      return;
    }
    return removeItem(e);
  }

  return (
    <Fragment>
      <div className="panel gutter">
        {
          length > 1 && <a href="#" className="float-right" onClick={confirmRemoveItem}>Remove</a>
        }
        <h2>{singular} {index + 1}</h2>
        <Fieldset
          fields={fields}
          values={values}
          prefix={prefix}
          noComments={noComments}
          onFieldChange={(key, value) => updateItem({ [key]: value })}
          updateItem={updateItem}
        />
      </div>
    </Fragment>
  );
}

export default function RepeaterField(props) {
  return (
    <Repeater {...props}>
      <Item {...props} />
    </Repeater>
  )
}
