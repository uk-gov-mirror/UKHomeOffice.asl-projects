import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

const Completable = ({ status = 'incomplete', legacy, readonly, children }) => {
  if (legacy || readonly) {
    return children;
  }

  let label;

  switch (status) {
    case 'deleted':
      label = 'Removed';
      break;
    case 'incomplete':
      label = 'In progress';
      break;
    default:
      label = 'Completed';
      break;
  }

  return (
    <Fragment>
      {
        <label className={classnames('status-label', status)}>{ label }</label>
      }
      { children }
    </Fragment>
  );
};

const mapStateToProps = ({ application: { schemaVersion, readonly } }) => ({ legacy: schemaVersion === 0, readonly });

export default connect(mapStateToProps)(Completable);
