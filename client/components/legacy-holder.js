import React, { Fragment } from 'react';
import { connect } from 'react-redux';


const LegacyHolder = ({ licenceHolder }) => {

  const {
    firstName,
    lastName
  } = licenceHolder;

  return (
    <Fragment>
       <div className="granted-section">
        <h2>Project licence holder</h2>
        <p className="licence-holder">{`${firstName} ${lastName}`}</p>
      </div>
    </Fragment>
  )
}

const mapStateToProps = ({ project: { licenceHolder } }) => ({ licenceHolder });

export default connect(mapStateToProps)(LegacyHolder);
