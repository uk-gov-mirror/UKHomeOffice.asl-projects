import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import RepeaterReview from './repeater/review';

const Establishments = ({ establishment, ...props }) => {
  return (
    <Fragment>
      <h3>Primary establishment</h3>
      <p>{ establishment.name }</p>

      <RepeaterReview {...props} />
    </Fragment>
  )
}

const mapStateToProps = ({ application: { establishment } }) => ({ establishment });

export default connect(mapStateToProps)(Establishments);
