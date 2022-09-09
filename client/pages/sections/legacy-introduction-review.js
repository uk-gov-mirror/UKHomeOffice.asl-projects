import React, { Fragment } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { formatDate } from '../../helpers';
import ReviewFields from '../../components/review-fields';
import Review from '../../components/review';
import Banner from '../../components/banner';
import { DATE_FORMAT } from '../../constants';

const LegacyIntroduction = ({ fields, project, values, pdf, readonly, title, licenceHolder }) => {

  if (readonly && !pdf) {
    const establishment = project ? project.establishment : null;
    const field = {
      label: 'Licence holder',
      name: 'holder',
      type: 'holder'
    };
    const holder = {
      licenceHolder,
      establishment
    };

    fields.splice(1, 0, field);
    values = { ...values, holder };
  }

  const continuationField = fields.find(f => f.name === 'continuation');

  return (
    <div className={classnames('introduction-review', { readonly })}>
      {!readonly && (
        <Fragment>
          <Banner>
            <h2>Please review your answers for</h2>
            <h1>{title}</h1>
          </Banner>
          <h1>{title}</h1>
        </Fragment>
      )}
      <ReviewFields
        values={values}
        fields={fields.filter(f => f.name !== 'continuation')}
      />
      {
        values.continuation && (
          <Review
            {...continuationField}
            label={continuationField.grantedLabel}
            value={values.continuation}
            values={values}
          >
            <dl className="inline">
              <dt>From the licence</dt>
              <dd>{values['continuation-licence-number']}</dd>
              <dt>Expiring on</dt>
              <dd>{values['continuation-expiry-date'] && formatDate(values['continuation-expiry-date'], DATE_FORMAT.long)}</dd>
            </dl>
          </Review>
        )
      }
      {readonly && !pdf && (
        <Fragment>
          {project.issueDate && (
            <div className='granted-section'>
              <h3>Date granted</h3>
              <p>{formatDate(project.issueDate, DATE_FORMAT.long)}</p>
            </div>
          )}
          {project.expiryDate && (
            <div className='granted-section'>
              <h3>Expiry date</h3>
              <p>{formatDate(project.expiryDate, DATE_FORMAT.long)}</p>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default connect(({
  project: values,
  application: { project, readonly, licenceHolder }
}) => ({
  values,
  project,
  readonly,
  licenceHolder
}))(LegacyIntroduction);
