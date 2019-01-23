import React from 'react';

import Field from './field';

const Fieldset = ({ fields, values = {}, onFieldChange, prefix = '' }) => (
  <fieldset>
    {
      fields.map(field => {
        return <Field
          { ...field }
          key={ field.name }
          name={ `${prefix}${field.name}` }
          value={ values[field.name] }
          onChange={ value => onFieldChange(field.name, value) }
          onSave={ value => onFieldChange(field.name, value) }
          onFieldChange={onFieldChange}
          values={ values }
        />
      })
    }
  </fieldset>
)

export default Fieldset;
