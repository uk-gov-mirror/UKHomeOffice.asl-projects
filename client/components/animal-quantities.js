import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash/size';
import map from 'lodash/map';
import Field from './field';

const AnimalQuantities = ({ label, hint, error, name, species, onFieldChange }) => {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
      { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
      {
        size(species)
          ? map(species, ({ fieldName, value }, key) => {
              return <Field
                key={key}
                type="text"
                name={fieldName}
                label={key}
                onChange={val => onFieldChange(fieldName, val)}
                value={value}
              />
            })
          : <p>No animals have been added</p>
      }
    </div>
  )
};

const mapStateToProps = ({ project }, { name }) => ({
  species: [
    ...(project.species || []),
    ...(project['species-other'] || [])
  ].reduce((obj, species) => {
    const fieldName = `${name}-${species}`;
    return {
      ...obj,
      [species]: {
        fieldName,
        value: project[fieldName]
      }
    };
  }, {})
});

export default connect(mapStateToProps)(AnimalQuantities);
