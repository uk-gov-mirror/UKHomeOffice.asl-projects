import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import Review from '../authorisations';

const Authorisarions = ({ granted, ...props }) => (
  <Fragment>
    {
      props.pdf && <h2>{props.title}</h2>
    }
    <ReactMarkdown className="grey">{granted.intro}</ReactMarkdown>
    <Review {...props} />
  </Fragment>
);

export default Authorisarions;
