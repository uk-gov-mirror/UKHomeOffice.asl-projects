import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import RepeaterReview from './repeater/review';

const LegacyEstablishments = ({ establishment, pdf, ...props }) => {

  const {
    name,
    licenceNumber
  } = establishment;

  return (
    <Fragment>
      {
        pdf && (
          <div className="granted-section">
            <h2>Primary establishment</h2>
            <dl className="inline">
              <dt>Establishment name: </dt>
              <dd>{ name }</dd>
              <dt>Licence number: </dt>
              <dd>{ licenceNumber }</dd>
            </dl>
          </div>
        )
      }

      <RepeaterReview {...props} />
    </Fragment>
  );
};

const mapStateToProps = ({ application: { establishment } }) => ({ establishment });

export default connect(mapStateToProps)(LegacyEstablishments);
