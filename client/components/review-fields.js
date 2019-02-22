import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import castArray from 'lodash/castArray';
import flatten from 'lodash/flatten';
import every from 'lodash/every';

import Review from './review';

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
  if (!field.conditional && !field.show) {
    return true;
  }
  if (field.show && typeof field.show === 'function') {
    return field.show(values);
  }
  return every(Object.keys(field.conditional), key => field.conditional[key] === values[key])
}

const ReviewFields = ({ fields, values, onEdit, project, readonly }) => (
  <Fragment>
    {
      castArray(values).map((item, i) => (
        <Fragment key={i}>
          {
            item.name && <h2>{item.name}</h2>
          }
          {
            flattenReveals(fields.filter(field => fieldIncluded(field, project)), item).map(field => {
              return <Review
                { ...field }
                label={ field.review || field.label }
                key={ field.name }
                readonly={ readonly }
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

const mapStateToProps = ({ project }) => ({ project })

export default connect(mapStateToProps)(ReviewFields);
