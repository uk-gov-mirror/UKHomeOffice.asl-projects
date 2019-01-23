import React, { Fragment } from 'react';
import Controls from '../../../components/controls';
import Fieldset from '../../../components/fieldset';

const Setup = ({ advance, exit, save, values, setup: { fields } }) => (
  <Fragment>
    <h1>Protocols</h1>
    <h2 className="subtitle">Please answer a few questions before adding your first protocol.</h2>
    <h3>Protocols setup</h3>
    <Fieldset
      fields={fields}
      onFieldChange={save}
      values={values}
    />
    <Controls onContinue={advance} onExit={exit} />
  </Fragment>
);

export default Setup;
