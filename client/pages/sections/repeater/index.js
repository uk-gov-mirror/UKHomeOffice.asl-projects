import React, { Fragment } from 'react';
import uuid from 'uuid/v4';
import { Markdown } from '@asl/components';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';

const Item = ({ index, fields, values, updateItem, removeItem, length, prefix, singular }) => (
  <Fragment>
    <div className="panel gutter">
      {
        length > 1 && <a href="#" className="float-right" onClick={removeItem}>Remove</a>
      }
      <h2>{singular} {index + 1}</h2>
      <Fieldset
        fields={fields}
        values={values}
        prefix={prefix}
        onFieldChange={(key, value) => updateItem({ [key]: value })}
      />
    </div>
  </Fragment>
)

const getItems = (values, repeats) => {
  const items = values[repeats];
  if (items && items.length) {
    return items;
  }
  // b/c - map previously selected additional establishments.
  if (repeats === 'establishments') {
    const otherEstablishments = values['other-establishments-list'];
    return (otherEstablishments || []).map(est => ({ 'establishment-name': est, id: uuid() }))
  }
}

const Items = ({ title, save, subtitle, intro, advance, repeats, exit, ...props }) => {
  return (
    <Fragment>
      <h1>{ title }</h1>
      {
        subtitle && <h2>{subtitle}</h2>
      }
      {
        intro && <Markdown className="grey" links={true}>{intro}</Markdown>
      }
      <Repeater
        items={getItems(props.values, repeats)}
        type={repeats}
        singular={props.singular}
        onSave={items => save({ [repeats]: items })}
      >
        <Item {...props} />
      </Repeater>
      <Controls onContinue={advance} onExit={exit} />
    </Fragment>
  )
}

export default Items;
