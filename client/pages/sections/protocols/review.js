import React, { Fragment } from 'react';
import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';

import Review from '../../../components/review';
import Controls from '../../../components/controls';
import Banner from '../../../components/banner';

const flattenReveals = fields => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options) {
      item.options.forEach(option => {
        if (option.reveal) {
          reveals.push(flattenReveals(castArray(option.reveal)))
        }
      })
    }
    return flatten([
      ...arr,
      item,
      flatten(reveals)
    ])
  }, []);
}

const ReviewSection = ({ fields = [], values, advance, onEdit }) => (
  <Fragment>
    <Banner>
      <h2>Please review your answers</h2>
    </Banner>
    {
      castArray(values).map(item => (
        <Fragment>
          {
            item.name && <h2>{item.name}</h2>
          }
          {
            flattenReveals(fields).map(field => {
              return <Review
                { ...field }
                label={ field.review || field.label }
                key={ field.name }
                value={ item[field.name] }
                onEdit={ () => onEdit() }
              />
            })
          }
        </Fragment>
      ))

    }
    <Controls
      onContinue={advance}
      exitClassName="link"
      exitLabel="Back"
      onExit={onEdit}
    />
  </Fragment>
)

export default ReviewSection;
