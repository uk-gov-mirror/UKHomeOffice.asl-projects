import React from 'react';
import ReactMarkdown from 'react-markdown';
import Review from '../authorisations';

const Authorisarions = ({ granted, ...props }) => (
  <div className="granted-authorisation">
    {
      props.pdf && <h2>{props.title}</h2>
    }
    <ReactMarkdown className="grey">{granted.intro}</ReactMarkdown>
    <Review {...props} />
  </div>
);

export default Authorisarions;
