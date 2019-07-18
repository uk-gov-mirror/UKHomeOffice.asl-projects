import React from 'react';
import Playback from '../../../components/playback'
import ObjectivesReview from '../objectives/review';

const ActionPlan = props => (
  <div className="granted-page action-plan">
    {
      props.pdf && <h2>{props.title}</h2>
    }
    <div className="granted-section">
      <Playback playback="project-aim" />
    </div>
    <ObjectivesReview {...props} />
  </div>
)

export default ActionPlan;
