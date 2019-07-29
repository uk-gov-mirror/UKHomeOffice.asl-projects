import React, { Fragment } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import ReviewFields from '../../components/review-fields';
import { DATE_FORMAT } from '../../constants';

const LegacyIntroduction = ({ fields, project, values, pdf, readonly }) => (
  <div className={classnames('introduction-review', { readonly })}>
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
    <ReviewFields
      values={values}
      fields={fields}
    />
    {
      readonly && !pdf && (
        <Fragment>
          <div className="granted-section">
            <h3>Date granted</h3>
            <p>{format(project.issueDate, DATE_FORMAT.long)}</p>
          </div>
          <div className="granted-section">
            <h3>Expiry date</h3>
            <p>{format(project.expiryDate, DATE_FORMAT.long)}</p>
          </div>
        </Fragment>
      )
    }
  </div>
)

export default connect(({
  project: values,
  application: { project, readonly }
}) => ({
  values,
  project,
  readonly
}))(LegacyIntroduction);
