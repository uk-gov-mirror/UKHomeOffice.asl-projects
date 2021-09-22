import React from 'react';
import Establishments from './establishments';
import Banner from '../../../components/banner';
import ReviewFields from '../../../components/review-fields';

export default function EstablishmentsReview({ steps, ...props }) {
  return (
    <div className="establishments-review">
      <Banner>
        <h2>Please review your answers for:</h2>
        <h1>Establishments</h1>
      </Banner>

      <ReviewFields {...props} fields={steps[0].fields} />

      <div className="repeats-establishments">
        <Establishments {...props} fields={steps[1].fields} editable={false} />
      </div>

      <ReviewFields {...props} fields={steps[2].fields} />

    </div>
  )
}
