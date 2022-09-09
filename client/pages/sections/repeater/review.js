import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isUndefined from 'lodash/isUndefined';

import Banner from '../../../components/banner';
import ReviewFields from '../../../components/review-fields';
import Review from '../../../components/review';

export function ReviewRepeater({ items = [], singular, fields, name, step, hideChanges, noComments }) {
  return (
    <Fragment>
      {
        items.map((item, index) => (
          <Fragment key={index}>
            <div key={index} className="panel gutter">
              <h2>{singular} {index + 1}</h2>
              {
                fields.map(field => {
                  const prefix = `${name}.${item.id}.`;
                  const editLink = !isUndefined(step) && `./${step}#${prefix}${field.name}`;
                  return (
                    <Review
                      key={field.name}
                      {...field}
                      value={item[field.name]}
                      prefix={prefix}
                      editLink={editLink}
                      hideChanges={hideChanges}
                      noComments={noComments}
                    />
                  );
                })
              }
            </div>
          </Fragment>
        ))
      }
    </Fragment>
  );
}

const ReviewSection = ({ title, steps, values, readonly, singular, repeaterFor }) => (
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
      steps.filter(s => !s.show || s.show(values)).map((step, index) => step.repeats
        ? values[repeaterFor] && <ReviewRepeater key={index} items={values[step.repeats]} fields={step.fields} step={index} name={step.repeats} singular={singular} />
        : <ReviewFields fields={step.fields} key={index} values={values} step={index} />
      )
    }

  </Fragment>
);

const mapStateToProps = ({ project, application: { readonly } }) => ({ project, readonly });

export default connect(mapStateToProps)(ReviewSection);
