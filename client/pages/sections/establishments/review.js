import React from 'react';
import { useSelector } from 'react-redux';
import Establishments from './establishments';
import Banner from '../../../components/banner';
import ReviewFields from '../../../components/review-fields';

export default function EstablishmentsReview({ steps, ...props }) {
  const { readonly } = useSelector(state => state.application);

  return (
    <div className="establishments-review">
      {
        !readonly &&
          <Banner>
            <h2>Please review your answers for:</h2>
            <h1>Establishments</h1>
          </Banner>
      }

      <ReviewFields {...props} fields={steps[0].fields} />

      <Establishments {...props} fields={steps[1].fields} editable={false} />

      <ReviewFields {...props} fields={steps[2].fields} />
    </div>
  )
}
