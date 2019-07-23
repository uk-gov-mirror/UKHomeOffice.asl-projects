import React from 'react';
import ReactMarkdown from 'react-markdown';
import Review from '../conditions';

const Conditions = ({ granted, ...props }) => (
  <div className="granted-condition">
    {
      !props.pdf && (
        <p>
          All <a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/193124/Project_Licence_-_Standard_Conditions.pdf" target="_blank" rel="noopener noreferrer">standard conditions of project licences</a> apply.<br />
          <span className="grey">Opens PDF in a new window.</span>
        </p>
      )
    }
    <h2>{granted.subtitle}</h2>
    <ReactMarkdown className="grey">{granted.intro}</ReactMarkdown>
    <Review {...props} />
  </div>
);

export default Conditions;
