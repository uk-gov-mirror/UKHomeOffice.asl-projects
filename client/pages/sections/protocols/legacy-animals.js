import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import ReviewFields from '../../../components/review-fields';

function LegacyAnimal({ updateItem, values, readonly, prefix, fields, index, editable, removeItem, length }) {
  function removeSpecies(e) {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this animal type?')) {
      removeItem();
    }
  }

  return (
    <Fragment>
      {
        (!readonly && editable)
          ? (
            <Fragment>
              <Fieldset
                prefix={prefix}
                fields={fields}
                values={values}
                index={index}
                type="species"
                onFieldChange={(key, value) => updateItem({ [key]: value })}
              />
              {
                length > 1 && <p><a href="#" onClick={removeSpecies}>Remove</a></p>
              }
            </Fragment>
          )
          : <ReviewFields
            prefix={prefix}
            fields={fields}
            values={values}
            editLink={`0#${prefix}`}
          />
      }
      <hr />
    </Fragment>
  );
}

const LegacyAnimals = ({ updateItem, title, values, fields, prefix, readonly, index, editable }) => (
  <Fragment>
    <h2>{title}</h2>
    <Repeater
      type="species"
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
