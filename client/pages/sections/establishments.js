import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import RepeaterReview from './repeater/review';

const Establishments = ({ isFullApplication, ...props }) => {
  return (
    <Fragment>
      {
        isFullApplication && <h2>Establishments</h2>
      }

      <RepeaterReview {...props} />
    </Fragment>
  )
}

const mapStateToProps = ({ application: { isFullApplication } }) => ({ isFullApplication });

export default connect(mapStateToProps)(Establishments);
