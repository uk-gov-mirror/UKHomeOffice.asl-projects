import React from 'react';

import Field from './field';

const Fieldset = ({ fields, onFieldChange, values, noComments, prefix = '' }) => (
  <fieldset>
    {
      fields.map(field => {
        return <Field
          { ...field }
          key={ field.name }
          name={ `${prefix}${field.name}` }
          value={ values && values[field.name] }
          values={ values }
          prefix={ prefix }
          onChange={ value => onFieldChange(field.name, value) }
          onFieldChange={onFieldChange}
          noComments={noComments}
        />
      })
    }
  </fieldset>
)

export default Fieldset;
