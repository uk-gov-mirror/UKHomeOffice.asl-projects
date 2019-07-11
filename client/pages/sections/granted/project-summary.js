import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Review from '../../../components/review';
import format from 'date-fns/format';

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
  const ra = (values.conditions || []).find(c => /retrospective-assessment/.test(c.key));
  return (
    <Fragment>
      {
        ra && (
          <div className="granted-section">
            <h3>{ra.title}</h3>
            <div className="purple-inset">
              <p>{ra.content}</p>
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
        <p>{format(project.issueDate, 'DD MMMM YYYY')}</p>
      </div>
      <div className="granted-section">
        <h3>Expiry date</h3>
        <p>{format(project.expiryDate, 'DD MMMM YYYY')}</p>
      </div>
      <div className="granted-section">
        <h3>Project location</h3>
        <p className="legal">You are authorised to undertake this programme of scientific procedures at the following places:</p>
        <ul>
          <li>
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
          </li>
          {
            values.establishments && values.establishments.map((e, i) => <li key={i}>{e.name}</li>)
          }
        </ul>
      </div>
      <div className="granted-section">
        <h3>Granted authority</h3>
        <ReactMarkdown className="legal">{grantedAuthority}</ReactMarkdown>
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
