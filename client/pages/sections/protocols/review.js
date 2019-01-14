import React, { Fragment } from 'react';

import Controls from '../../../components/controls';
import Review from '../review'

const ReviewSection = ({ advance, exit, ...props }) => (
  <Fragment>
    <Review { ...props } />
    <Controls
      onContinue={advance}
      exitClassName="link"
      onExit={exit}
    />
  </Fragment>
)

export default ReviewSection;
