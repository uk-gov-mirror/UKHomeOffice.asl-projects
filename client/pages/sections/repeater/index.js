import React, { Fragment } from 'react';
import uuid from 'uuid/v4';
import { Markdown } from '@asl/components';

import Repeater from '../../../components/repeater-field';
import Controls from '../../../components/controls';

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

const Items = ({
  title,
  save,
  subtitle,
  intro,
  advance,
  repeats,
  exit,
  ...props
}) => {
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
      />
      <Controls onContinue={advance} onExit={exit} />
    </Fragment>
  )
}

export default Items;
