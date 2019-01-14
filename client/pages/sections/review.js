import React, { Fragment } from 'react';
import { connectProject } from '../../helpers';

import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';
import every from 'lodash/every';

import Review from '../../components/review';
import Banner from '../../components/banner';
import NTS from '../../components/nts'

const flattenReveals = (fields, values) => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options) {
      item.options.forEach(option => {
        if (option.reveal) {
          if (Array.isArray(values[item.name]) && values[item.name].includes(option.value)) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
          else if (option.value === values[item.name]) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
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

const fieldIncluded = (field, values) => {
  if (!field.conditional) {
    return true;
  }
  return every(Object.keys(field.conditional), key => field.conditional[key] === values[key])
}

const ReviewSection = ({ fields = [], nts, values, onContinue, advance, onEdit, project, exit, title }) => (
  <Fragment>
    <Banner>
      <h2>{`Please review your answers${title ? ' for:' : ''}`}</h2>
      {
        title && <h1>{ title }</h1>
      }
    </Banner>
    {
      nts && <NTS review={true} />
    }
    {
      castArray(values).map(item => (
        <Fragment>
          {
            item.name && <h2>{item.name}</h2>
          }
          {
            flattenReveals(fields.filter(field => fieldIncluded(field, project)), item).map(field => {
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
  </Fragment>
);

export default connectProject(ReviewSection);