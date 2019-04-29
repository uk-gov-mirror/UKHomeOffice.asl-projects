import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Review from '../../../components/review';
import Banner from '../../../components/banner';
import Playback from '../../../components/playback';

const ObjectivesReview = ({ playback, values, steps, goto, readonly }) => (
  <Fragment>
    {
      !readonly && (
        <Fragment>
          <Banner>
            <h2>Please review your answers for</h2>
            <h1>Action plan</h1>
          </Banner>
          <h1>Action plan</h1>
          <Playback playback={playback} />
        </Fragment>
      )
    }
    <h3>What are your scientific objectives or research questions?</h3>
    <p className="grey">Each objective should be as SMART (specific, measurable, achievable, realistic, time-related) as possible.</p>
    <p className="grey">It should be possible to determine, in five years’ time, whether or not your objectives were met, assuming all lines of enquiry are pursued.</p>
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
      steps[1].fields.map((field, index) => (
        <Review
          key={index}
          {...field}
          value={values[field.name]}
          onEdit={() => goto(1)}
        />
      ))
    }
  </Fragment>
);

const mapStateToProps = ({ application: { readonly } }) => ({ readonly })

export default connect(mapStateToProps)(ObjectivesReview);
