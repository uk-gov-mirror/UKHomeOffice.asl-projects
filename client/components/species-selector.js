import React, { Component, Fragment } from 'react';
import map from 'lodash/map';
import intersection from 'lodash/intersection';

import SPECIES from '../constants/species';
import SPECIES_CATEGORIES from '../constants/species-categories';

import Fieldset from './fieldset';

const getFields = (options, name) => ([
  {
    name,
    label: '',
    type: 'checkbox',
    className: 'smaller',
    options
  }
]);

class SpeciesSelector extends Component {
  isOpen = options => {
    return intersection(this.props.values[this.props.name], options.map(option => option.value)).length > 0
  }

  render() {
    const {
      species = SPECIES,
      categories = SPECIES_CATEGORIES,
      values,
      onFieldChange,
      label,
      otherLabel = 'Which species will you be using',
      name = 'species',
      hint,
      summary
    } = this.props;
    return (
      <Fragment>
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{this.props.hint}</span> }
        {
          map(species, (options, code) => (
            <details open={this.isOpen(options)}>
              <summary>{SPECIES_CATEGORIES[code]}</summary>
              <Fieldset
                fields={getFields(options, name)}
                values={values}
                onFieldChange={onFieldChange}
              />
            </details>
          ))
        }
        <details open={!!values[`${this.props.name}-other`]}>
          <summary>Other</summary>
          <Fieldset
            fields={[
              {
                name: `${name}-other`,
                label: otherLabel,
                type: 'text'
              }
            ]}
            values={values}
            onFieldChange={onFieldChange}
          />
        </details>
        { /* TODO: species summary section - awaiting designs */ }
      </Fragment>
    )
  }
}

export default SpeciesSelector;
