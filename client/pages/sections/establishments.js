import React from 'react';
import { connect } from 'react-redux';
import RepeaterReview from './repeater/review';

const Establishments = ({ isFullApplication, ...props }) => {
  return (
    <div className="repeats-establishments">
      {
        isFullApplication && <h2>Establishments</h2>
      }

      <RepeaterReview {...props} />
    </div>
  )
}

const mapStateToProps = ({ application: { isFullApplication } }) => ({ isFullApplication });

export default connect(mapStateToProps)(Establishments);
