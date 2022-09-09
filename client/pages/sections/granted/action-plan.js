import React from 'react';
import ObjectivesReview from '../objectives/review';

const ActionPlan = props => (
  <div className="granted-page action-plan">
    {
      props.pdf && <h2>{props.title}</h2>
    }
    <ObjectivesReview {...props} />
  </div>
);

export default ActionPlan;
