import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import ReviewFields from '../../../components/review-fields';

const LegacyAnimal = ({ updateItem, values, readonly, prefix, fields, index, editable }) => (
  <Fragment>
    {
      (!readonly && editable)
        ? <Fieldset
          prefix={prefix}
          fields={fields}
          values={values}
          index={index}
          type="species"
          onFieldChange={(key, value) => updateItem({ [key]: value })}
        />
        : <ReviewFields
          fields={fields}
          values={values}
          editLink={`0#${prefix}`}
        />
    }
    <hr />
  </Fragment>
)

const LegacyAnimals = ({ updateItem, title, values, fields, prefix, readonly, index, editable }) => (
  <Fragment>
    <h2>{title}</h2>
    <Repeater
      items={values.species}
      addAnother={!!editable}
      onSave={species => updateItem({ species })}
      prefix={prefix}
      index={index}
    >
      <LegacyAnimal
        readonly={readonly}
        fields={fields}
        editable={editable}
      />
    </Repeater>
  </Fragment>
);

export default connect(({ application: { readonly } }) => ({ readonly }))(LegacyAnimals);
