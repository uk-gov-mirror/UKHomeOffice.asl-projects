import React from 'react';
import { connect } from 'react-redux';
import Legacy from './v0';
import Modern from './v1';

const PDF = ({ schemaVersion }) => {
  if (schemaVersion === 0) {
    return <Legacy />;
  }
  return <Modern />;
};

const mapStateToProps = ({ application: { schemaVersion } }) => ({ schemaVersion })

export default connect(mapStateToProps)(PDF);
