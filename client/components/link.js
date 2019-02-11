import React from 'react';

const Link = ({ to, label }) => {
  if (!label) {
    label = `View ${to}`;
  }
  return <a href={`/${to}`}>{ label }</a>;
}

export default Link;
