import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

import Fieldset from './fieldset'

const getNumbers = length => Array.apply(null, { length }).map(Number.call, String);

const getFields = (years) => {
  return [
    {
      name: 'years',
      label: 'Years',
      type: 'select',
      options: getNumbers(6)
    },
    {
      name: 'months',
      label: 'Months',
      type: 'select',
      options: getNumbers(years < 5 ? 12 : 1)
    }
  ]
};

const Duration = ({ name, error, label, hint, value, onChange }) => {

  const [years, setYears] = useState(value.years);
  const [months, setMonths] = useState(value.months);

  useEffect(() => {
    onChange({ months, years });
  }, [years, months]);

  useEffect(() => {
    if (years === 5) {
      setMonths(0);
    }
  }, [years]);

  const onFieldChange = (key, value) => {
    value = parseInt(value);
    if (key === 'years') {
      setYears(value);
    }
    if (key === 'months') {
      setMonths(value);
    }
  };

  return (
    <div className={classnames('govuk-form-group', 'duration', { 'govuk-form-group--error': error })}>
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
      { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
      <Fieldset
        fields={getFields(years)}
        onFieldChange={onFieldChange}
        values={{ years, months }}
        noComments={true}
      />
    </div>
  )

};

export default Duration;
