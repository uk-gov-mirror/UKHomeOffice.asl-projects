import React, { Component } from 'react';
import { connect } from 'react-redux';

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
            label: `Which ${option.label.charAt(0).toLowerCase()}${option.label.substring(1)} will you be using?`,
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
      this.props.speciesValues,
      options.map(option => option.value)
    ).length > 0;
  }

  render() {
    const {
      species = SPECIES,
      values,
      otherValues,
      onFieldChange,
      label,
      name,
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
                noComments={true}
              />
            </details>
          ))
        }
        <details open={otherValues.length}>
          <summary>Other</summary>
          <br />
          <OtherSpecies
            name={`${name}-other`}
            values={otherValues}
            onFieldChange={onFieldChange}
          />
        </details>
      </div>
    )
  }
}

const mapStateToProps = ({ project }, { name = 'species' }) => ({
  speciesValues: project.species,
  otherValues: project[`${name}-other`] || []
});

export default connect(mapStateToProps)(SpeciesSelector);
