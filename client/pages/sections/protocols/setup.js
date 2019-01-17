import React, { Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';
import Fieldset from '../../../components/fieldset';

const Setup = ({ advance, save, values, setup: { fields } }) => (
  <Fragment>
    <h1>Protocols</h1>
    <h2 className="subtitle">Please answer a few questions before adding your first protocol.</h2>
    <h3>Protocols setup</h3>
    <Fieldset
      fields={fields}
      onFieldChange={save}
      values={values}
    />
    <Button onClick={advance}>Continue</Button>
  </Fragment>
)

export default Setup;
