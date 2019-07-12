import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import Review from '../authorisations';

const Authorisarions = ({ granted, ...props }) => (
  <Fragment>
    <ReactMarkdown className="grey">{granted.intro}</ReactMarkdown>
    <Review {...props} />
  </Fragment>
);

export default Authorisarions;
