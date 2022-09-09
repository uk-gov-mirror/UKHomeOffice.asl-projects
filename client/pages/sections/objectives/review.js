import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';
import Banner from '../../../components/banner';
import Playback from '../../../components/playback';

const ObjectivesReview = ({ playback, values, steps, goto, readonly, isFullApplication }) => (
  <Fragment>
    {
      !readonly && (
        <Fragment>
          <Banner>
            <h2>Please review your answers for</h2>
            <h1>Action plan</h1>
          </Banner>
          <h1>Action plan</h1>
        </Fragment>
      )
    }
    <Playback playback={playback} />
    {
      isFullApplication && <h2>Action plan</h2>
    }
    <h3>What are your scientific objectives or research questions?</h3>
    <p className="grey hint">Each objective should be as SMART (specific, measurable, achievable, realistic, time-related) as possible.</p>
    <p className="grey hint">It should be possible to determine, in five years’ time, whether or not your objectives were met, assuming all lines of enquiry are pursued.</p>
    <hr />
    {
      (values.objectives || []).map((objective, index) => (
        <div className="objective-review" key={index}>
          <h2>Objective {index + 1}</h2>
          <Review
            key={index}
            {...steps[0].fields.find(f => f.name === 'title')}
            value={objective.title}
            prefix={`objectives.${objective.id}.`}
            onEdit={() => goto(0)}
          />
          <hr />
        </div>
      ))
    }

    {
      steps.map((step, index) => (
        <ReviewFields
          key={index}
          fields={step.fields.filter(f => !f.repeats)}
          values={values}
          step={index}
        />
      ))
    }
  </Fragment>
);

const mapStateToProps = ({ application: { readonly, isFullApplication } }) => ({ readonly, isFullApplication });

export default connect(mapStateToProps)(ObjectivesReview);
