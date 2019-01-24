import React, { Component } from 'react';

import map from 'lodash/map';
import intersection from 'lodash/intersection';

import SPECIES from '../constants/species';
import SPECIES_CATEGORIES from '../constants/species-categories';

import Fieldset from './fieldset';
import OtherSpecies from './other-species-selector';

const getFields = (options, name) => ([
  {
    name,
    label: '',
    type: 'checkbox',
    className: 'smaller',
    options: options.map(option => {
      if (option.value.indexOf('other') > -1) {
        return {
          ...option,
          reveal: {
            label: `Which ${option.label.charAt(0).toLowerCase()}${option.label.substring(1)} will you be using`,
            name: `${name}-${option.value}`,
            type: 'other-species-selector'
          }
        }
      }
      return option
    })
  }
])

class SpeciesSelector extends Component {
  isOpen = options => {
    return intersection(
      this.props.values.species,
      options.map(option => option.value)
    ).length > 0;
  }

  render() {
    const {
      species = SPECIES,
      values,
      onFieldChange,
      label,
      name = 'species',
      hint,
      summary
    } = this.props;
    return (
      <div className="species-selector">
        <label className="govuk-label" htmlFor={name}>{label}</label>
        {
          hint && <span id={`${name}-hint`} className="govuk-hint">{this.props.hint}</span>
        }
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
        <details open={values[`${this.props.name}-other`] && values[`${this.props.name}-other`].length}>
          <summary>Other</summary>
          <br />
          <OtherSpecies
            name={`${this.props.name}-other`}
            values={values[`${this.props.name}-other`]}
            onFieldChange={onFieldChange}
          />
        </details>
      </div>
    )
  }
}

export default SpeciesSelector;
