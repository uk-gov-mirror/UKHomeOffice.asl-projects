import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

const Completable = ({ status = 'incomplete', legacy, children }) => (
  <Fragment>
    { !legacy &&
      <label className={classnames('status-label', status)}>
        { status === 'incomplete' ? 'In progress' : 'Completed' }
      </label>
    }
    { children }
  </Fragment>
)

const mapStateToProps = ({ application: { schemaVersion } }) => ({ legacy: schemaVersion === 0 });

export default connect(mapStateToProps)(Completable);
