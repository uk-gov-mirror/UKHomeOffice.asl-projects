import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import uuid from 'uuid/v4';

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

const Items = ({ title, save, subtitle, intro, advance, repeats, exit, ...props }) => {
  return (
    <Fragment>
      <h1>{ title }</h1>
      {
        subtitle && <h2>{subtitle}</h2>
      }
      {
        intro && <ReactMarkdown className="grey">{intro}</ReactMarkdown>
      }
      <Repeater
        items={(props.values[repeats] || []).map(item => typeof item === 'string' ? { name: item, id: uuid() } : item)}
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
