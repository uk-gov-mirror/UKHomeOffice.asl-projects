import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import castArray from 'lodash/castArray';

import Banner from '../../../components/banner';
import Playback from '../../../components/playback';
import Review from '../../../components/review';

const EstablishmentsReview = ({ fields, values, goto, retreat, readonly, schemaVersion }) => {
  const establishments = castArray(values.establishments).filter(f => values['other-establishments'] && f && values['other-establishments-list'].includes(f.name))
  return (
    <Fragment>
      {
        !readonly && (
          <Fragment>
            <Banner>
              <h2>Please review your answers for:</h2>
              <h1>Establishments</h1>
            </Banner>
            <Playback playback="primary-establishment" />
          </Fragment>
        )
      }
      <Review
        {...fields.find(f => f.name === 'other-establishments')}
        value={values['other-establishments']}
        onEdit={() => goto(0)}
      />
      {
        establishments.map((establishment, index) => (
          <div key={index} className="establishment-review">
            <div className="playback">
              <dl className="inline">
                <dt>Additional establishment: </dt>
                <dd>
                  <span>{ establishment.name }</span>
                  {
                    !readonly && <a href="#other-establishments-list" onClick={() => goto(0)}>Edit</a>
                  }
                </dd>
              </dl>
            </div>
            {
              fields.filter(f => f.repeats).map((field, index) => (
                <Review
                  key={index}
                  {...field}
                  value={establishment[field.name]}
                />
              ))
            }
          </div>
        ))
      }
      {
        // only show these fields when viewing a non-legacy PPL
        schemaVersion === 1 && (
          <Fragment>
            <Review
              {...fields.find(f => f.name === 'establishments-care-conditions')}
              value={values['establishments-care-conditions']}
              onEdit={retreat}
            />
            {
              values['establishments-care-conditions'] === false && (
                <Review
                  {...fields.find(f => f.name === 'establishments-care-conditions').options[1].reveal}
                  value={values['establishments-care-conditions-justification']}
                  onEdit={retreat}
                  />
              )
            }
          </Fragment>
        )
      }
    </Fragment>
  )
}

const mapStateToProps = ({ application: { readonly, schemaVersion } }) => ({ readonly, schemaVersion });

export default connect(mapStateToProps)(EstablishmentsReview);
