
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import RepeaterReview from '../../pages/sections/repeater/review';

const LegacyEstablishment = ({ title, steps, values, readonly, singular, enable,
establishment: {
  name,
  licenceNumber,
  address,
  licenceHolder: {
    firstName,
    lastName
  }
}
}) => {
  return (
    <Fragment>
       <dl className="inline">
          <dt>Primary establishment: </dt>
          <dd>{ name }</dd>
          <dt>Establishment licence number: </dt>
          <dd>{ licenceNumber }</dd>
          <dt>Establishment licence holder: </dt>
          <dd>{firstName} {lastName}</dd>
          <dt>Address: </dt>
          <dd>{ address }</dd>
        </dl>
      <RepeaterReview title={title} steps={steps} values={values} readonly={readonly} singular={singular} enable={enable} />
    </Fragment>
  )
}

const mapStateToProps = ({ project, application: { readonly, establishment } }) => ({ project, readonly, establishment });

export default connect(mapStateToProps)(LegacyEstablishment);
