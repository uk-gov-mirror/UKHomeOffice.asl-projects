import React from 'react';
import { useSelector } from 'react-redux';

export default function NextSteps() {
  const { isActionable, taskLink } = useSelector(state => state.application)
  if (!isActionable) {
    return null;
  }
  return (
    <p className="next-steps">
      <a className="govuk-button" href={taskLink}>Next steps</a>
      <span className="status-message"></span>
    </p>
  );
}
