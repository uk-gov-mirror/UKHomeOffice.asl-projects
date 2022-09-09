import React from 'react';
import { Link } from 'react-router-dom';

const LinkTo = ({ to, label }) => {
  if (!label) {
    label = `View ${to}`;
  }
  return <Link to={`/${to}`}>{ label }</Link>;
};

export default LinkTo;
