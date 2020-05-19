import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import RepeaterReview from './repeater/review';

const Establishments = ({ establishment, isFullApplication, ...props }) => {
  return (
    <Fragment>
      {
        isFullApplication && <h2>Establishments</h2>
      }
      <div className="review">
        <h3>Primary establishment</h3>
        <p>{ establishment.name }</p>
      </div>

      <RepeaterReview {...props} />
    </Fragment>
  )
}

const mapStateToProps = ({ application: { establishment, isFullApplication } }) => ({ establishment, isFullApplication });

export default connect(mapStateToProps)(Establishments);
