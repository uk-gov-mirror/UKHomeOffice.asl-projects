import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Controls from '../../../components/controls';
import Fieldset from '../../../components/fieldset';

const Setup = ({ advance, exit, save, project, setup: { fields } }) => (
  <Fragment>
    <h1>Protocols</h1>
    <h2 className="subtitle">Please answer a few questions about your project before you add your first protocol.</h2>
    <h3>Protocols setup</h3>
    <Fieldset
      fields={fields}
      onFieldChange={save}
      values={project}
    />
    <Controls onContinue={advance} onExit={exit} />
  </Fragment>
);

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Setup);
