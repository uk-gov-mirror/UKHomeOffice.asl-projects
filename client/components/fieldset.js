import React from 'react';

import Field from './field';

const Fieldset = ({ fields, onFieldChange, prefix = '' }) => (
  <fieldset>
    {
      fields.map(field => {
        return <Field
          { ...field }
          key={ field.name }
          name={ `${prefix}${field.name}` }
          onChange={ value => onFieldChange(field.name, value) }
          onSave={ value => onFieldChange(field.name, value) }
          onFieldChange={onFieldChange}
        />
      })
    }
  </fieldset>
)

export default Fieldset;
