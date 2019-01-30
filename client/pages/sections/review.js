import React, { Fragment } from 'react';

import ReviewFields from '../../components/review-fields';
import Banner from '../../components/banner';
import NTS from '../../components/nts'
import Playback from '../../components/playback';

const ReviewSection = ({
  fields = [],
  nts,
  values,
  onEdit,
  title,
  playback,
  reviewTitle
}) => {
  const displayTitle = reviewTitle || title || false;
  return (
    <Fragment>
      <Banner>
        <h2>{`Please review your answers${displayTitle ? ' for:' : ''}`}</h2>
        {
          displayTitle && <h1>{ displayTitle }</h1>
        }
      </Banner>
      {
        nts && <NTS review={true} />
      }
      {
        playback && <Playback playback={playback} />
      }
      <ReviewFields fields={fields} values={values} onEdit={onEdit} />
    </Fragment>
  )
}

export default ReviewSection;
