import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import ReviewFields from '../../../components/review-fields';

const LegacyAnimal = ({ updateItem, values, editable, prefix, fields, index }) => (
  <Fragment>
    {
      editable
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

const LegacyAnimals = ({ updateItem, values, fields, prefix, advance, editable, index }) => (
  <Fragment>
    <Repeater
      items={values.species}
      addAnother={editable}
      onSave={species => updateItem({ species })}
      prefix={prefix}
      index={index}
    >
      <LegacyAnimal
        editable={editable}
        fields={fields}
      />
    </Repeater>
    {
      editable && <Button className="button-secondary" onClick={advance}>Next section</Button>
    }
  </Fragment>
);

const mapStateToProps = ({ project }, { index }) => ({ values: project.protocols[index] })

export default connect(mapStateToProps)(LegacyAnimals);
