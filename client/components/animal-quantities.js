import React from 'react';
import Field from './field';

const getSpecies = values => {
  const species = values.species || []
  if (values['species-other']) {
    return [
      ...species,
      values['species-other']
    ]
  }
  return species;
}

const AnimalQuantities = ({ label, hint, error, name, values, onFieldChange }) => {
  const species = getSpecies(values);
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
      { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
      {
        species.length
          ? species.map(species => {
              const fieldName = `${name}-${species}`;
              return <Field
                type="number"
                name={fieldName}
                label={species}
                onChange={val => onFieldChange(fieldName, val)}
                value={values[fieldName]}
              />
            })
          : <p>No species have been added</p>
      }
    </div>
  )
}

export default AnimalQuantities;
