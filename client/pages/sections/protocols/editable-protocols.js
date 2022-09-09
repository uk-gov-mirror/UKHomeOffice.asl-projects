import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Protocols from './protocols';
import Controls from '../../../components/controls';
import ProtocolConditions from './protocol-conditions';

const EditableProtocols = ({ advance, exit, ...props }) => (
  <Fragment>
    <p><Link to="/protocol-summary" target="_blank">View summary table (opens in a new tab)</Link></p>
    <ProtocolConditions />

    <h2>Protocol details</h2>
    <p>Please enter the details of the protocols that make up this project.</p>
    <Protocols {...props} />

    <Controls onContinue={advance} onExit={exit} />
  </Fragment>
);

export default EditableProtocols;
