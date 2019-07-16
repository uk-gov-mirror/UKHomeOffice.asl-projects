import React, { Fragment } from 'react';
import last from 'lodash/last';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Review from '../../../components/review';
import format from 'date-fns/format';
import CONDITIONS from '../../../constants/conditions';

import { DATE_FORMAT } from '../../../constants';

const ProjectSummary = ({
  project,
  values,
  granted: {
    licenceHolderLegal,
    grantedAuthority
  },
  establishment: {
    name,
    licenceNumber,
    address,
    licenceHolder: {
      firstName,
      lastName
    }
  },
  fields
}) => {
  const retrospectiveAssessment = (values.conditions || []).find(c => /^retrospective-assessment$/.test(c.key)) ||
    last(CONDITIONS.inspector['retrospective-assessment-negative'].versions);
  return (
    <Fragment>
      {
        retrospectiveAssessment && (
          <div className="granted-section">
            <h3>{retrospectiveAssessment.title}</h3>
            <div className="purple-inset">
              <p>{retrospectiveAssessment.content}</p>
            </div>
          </div>
        )
      }
      <div className="granted-section">
        <h3>Project licence number</h3>
        <p>{project.licenceNumber}</p>
      </div>
      <div className="granted-section">
        <h3>Project licence holder</h3>
        <p>{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</p>
        <ReactMarkdown className="legal">{licenceHolderLegal}</ReactMarkdown>
      </div>
      <div className="granted-section">
        <Review
          {...fields.find(f => f.name === 'duration')}
          value={values.duration}
          noComments
        />
      </div>
      <div className="granted-section">
        <h3>Date granted</h3>
        <p>{format(project.issueDate, DATE_FORMAT.long)}</p>
      </div>
      <div className="granted-section">
        <h3>Expiry date</h3>
        <p>{format(project.expiryDate, DATE_FORMAT.long)}</p>
      </div>
      <div className="granted-section">
        <h3>Project location</h3>
        <p className="legal">You are authorised to undertake this programme of scientific procedures at the following places:</p>
        <div className="granted-section">
          <h3>Primary establishment</h3>
          <p>{ name }</p>
          <dl className="inline">
            <dt>Establishment licence number: </dt>
            <dd>{ licenceNumber }</dd>
            <dt>Establishment licence holder: </dt>
            <dd>{firstName} {lastName}</dd>
            <dt>Address: </dt>
            <dd>{ address }</dd>
          </dl>
        </div>
        {
          values.establishments && !!values.establishments.length && (
            <div className="granted-section">
              <h3>Additional establishments</h3>
              <ul>
                {
                  values.establishments.map((e, i) => <li key={i}><strong>{e['establishment-name']}</strong></li>)
                }
              </ul>
            </div>
          )
        }
        {
          values.polesList && !!values.polesList.length && (
            <div className="granted-section">
              <h3>Places other than a licensed establishment (POLEs):</h3>
              <ul>
                {
                  values.polesList.map((p, i) => (
                    <li key={i}>
                      <strong>{p.title}</strong><br />
                      <Review
                        type="texteditor"
                        value={p['pole-info']}
                      />
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
      <div className="granted-section">
        <h3>Granted authority</h3>
        <ReactMarkdown className="legal">{grantedAuthority(project.licenceNumber)}</ReactMarkdown>
      </div>
    </Fragment>
  );
}

export default connect(({
  project: values,
  application: { project, establishment }
}) => ({
  values,
  project,
  establishment
}))(ProjectSummary);
