import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Banner from '../../../components/banner';
import ReviewFields from '../../../components/review-fields';
import Review from '../../../components/review';

const ReviewRepeater = ({ items = [], singular, fields, name, step }) => (
  <Fragment>
    {
      items.map((item, index) => (
        <Fragment key={index}>
          <div key={index} className="panel">
            <h2>{singular} {index + 1}</h2>
            {
              fields.map(field => (
                <Review
                  key={field.name}
                  {...field}
                  value={item[field.name]}
                  prefix={`${name}.${item.id}.`}
                  editLink={`./${step}#${field.name}`}
                />
              ))
            }
          </div>
        </Fragment>
      ))
    }
  </Fragment>
);

const ReviewSection = ({ title, steps, values, readonly, singular, enable }) => (
  <Fragment>
    {
      !readonly && (
        <Banner>
          <h2>Please review your answers for:</h2>
          <h1>{ title }</h1>
        </Banner>
      )
    }
    {
      steps.map((step, index) => step.repeats
        ? values[enable] && <ReviewRepeater key={index} items={values[step.repeats]} fields={step.fields} step={index} name={step.repeats} singular={singular} />
        : <ReviewFields fields={step.fields} key={index} values={values} step={index} />
      )
    }

  </Fragment>
)

const mapStateToProps = ({ project, application: { readonly } }) => ({ project, readonly });

export default connect(mapStateToProps)(ReviewSection);
