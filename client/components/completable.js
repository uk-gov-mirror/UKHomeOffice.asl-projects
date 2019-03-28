import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

const Completable = ({ status = 'incomplete', legacy, readonly, children }) => {
  if (legacy || readonly) {
    return children;
  }

  return (
    <Fragment>
      {
        <label className={classnames('status-label', status)}>
          { status === 'incomplete' ? 'In progress' : 'Completed' }
        </label>
      }
      { children }
    </Fragment>
  );
};

const mapStateToProps = ({ application: { schemaVersion, readonly } }) => ({ legacy: schemaVersion === 0, readonly });

export default connect(mapStateToProps)(Completable);
