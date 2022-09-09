import React, { useState, Fragment } from 'react';
import Field from './field';
import LEGACY_SPECIES from '../constants/legacy-species';

export default function LegacySpeciesSelector(props) {
  const otherSpeciesId = '28';
  const [isOtherSpecies, setIsOtherSpecies] = useState(props.value === otherSpeciesId);

  function onSpeciesChange(value) {
    setIsOtherSpecies(value === otherSpeciesId);
    props.onChange(value);
  }

  function onOtherSpeciesChange(value) {
    props.onFieldChange('other-species-type', value);
  }

  return (
    <Fragment>
      <Field
        {...props}
        type="select"
        options={LEGACY_SPECIES}
        onChange={onSpeciesChange}
      />
      {
        isOtherSpecies && (
          <Field
            label="Type of animals"
            name={`${props.name}-other-species-type`}
            type="text"
            value={props.values['other-species-type']}
            onChange={onOtherSpeciesChange}
          />
        )
      }
    </Fragment>
  );
}
