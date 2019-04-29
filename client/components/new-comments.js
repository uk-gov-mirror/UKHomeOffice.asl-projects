import React from 'react';

const NewComments = ({ comments }) => {
  if (!comments) {
    return null;
  }
  const label = comments === 1 ? 'comment' : 'comments';
  return <span className="badge comments">{`${comments} new ${label}`}</span>;
};

export default NewComments;
