import React, { Component, Fragment } from 'react';
import map from 'lodash/map';
import intersection from 'lodash/intersection';

import SPECIES from '../constants/species';
import SPECIES_CATEGORIES from '../constants/species-categories';

import Fieldset from './fieldset';

const getFields = options => ([
  {
    name: 'species',
    label: '',
    type: 'checkbox',
    className: 'smaller',
    options
  }
]);

class SpeciesSelector extends Component {
  constructor(props) {
    super(props);
    this.isOpen = this.isOpen.bind(this);
  }

  isOpen(options) {
    return intersection(this.props.values.species, options).length > 0
  }

  render() {
    const { species = SPECIES, categories = SPECIES_CATEGORIES, values, onFieldChange } = this.props;
    return (
      <Fragment>
        <h3>What types of animals will be used in this project?</h3>
        {
          map(species, (options, code) => (
            <details open={this.isOpen(options)}>
              <summary>{SPECIES_CATEGORIES[code]}</summary>
              <Fieldset
                fields={getFields(options)}
                values={values}
                onFieldChange={onFieldChange}
              />
            </details>
          ))
        }
        <details>
          <summary>Other</summary>
          <p>something</p>
        </details>
      </Fragment>
    )
  }
}

export default SpeciesSelector;
