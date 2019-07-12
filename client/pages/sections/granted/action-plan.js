import React from 'react';
import Playback from '../../../components/playback'
import ObjectivesReview from '../objectives/review';

const ActionPlan = props => (
  <div className="granted-page action-plan">
    <div className="granted-section">
      <Playback playback="project-aim" />
    </div>
    <ObjectivesReview {...props} />
  </div>
)

export default ActionPlan;
