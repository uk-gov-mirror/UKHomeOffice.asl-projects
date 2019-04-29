import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Banner from '../../../components/banner';
import Review from '../../../components/review';

const ReviewSection = ({ title, fields, values, readonly }) => (
  <Fragment>
    {
      !readonly && (
        <Banner>
          <h2>Please review your answers for:</h2>
          <h1>{ title }</h1>
        </Banner>
      )
    }
    <Review
      {...fields.find(f => f.name === 'poles')}
      value={values.poles}
      editLink="/poles/0#poles"
    />
    {
      values.poles && (
        <Fragment>
          <Review
            {...fields.find(f => f.name === 'poles').options[0].reveal}
            value={values['poles-justification']}
            editLink="/poles/0#poles-justification"
          />
          {
            values.polesList && values.polesList.map((pole, index) => (
              <Fragment key={index}>
                <div key={index} className="panel">
                  <h2>POLE {index + 1}</h2>
                  <Review
                    {...fields.find(f => f.name === 'title')}
                    value={pole.title}
                    prefix={`pole.${pole.id}.`}
                    editLink="/poles/1#title"
                  />
                  <Review
                    {...fields.find(f => f.name === 'pole-info')}
                    value={pole['pole-info']}
                    prefix={`pole.${pole.id}.`}
                    editLink="/poles/1#pole-info"
                  />
                </div>
              </Fragment>
            ))
          }
          <Review
            {...fields.find(f => f.name === 'poles-inspection')}
            value={values['poles-inspection']}
            editLink="/poles/2#poles-inspection"
          />
          <Review
            {...fields.find(f => f.name === 'poles-transfer')}
            value={values['poles-transfer']}
            editLink="/poles/2#poles-transfer"
          />
          {
            values['poles-transfer'] && fields.find(f => f.name === 'poles-transfer').options[0].reveal.map((field, index) => (
              <Review
                key={index}
                {...field}
                value={values[field.name]}
                editLink={`/poles/2#${field.name}`}
              />
            ))
          }
        </Fragment>
      )
    }

  </Fragment>
)

const mapStateToProps = ({ project, application: { readonly } }) => ({ project, readonly });

export default connect(mapStateToProps)(ReviewSection);
