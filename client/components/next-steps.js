import React from 'react';
import { useSelector } from 'react-redux';

export default function NextSteps() {
  const { isActionable, taskLink } = useSelector(state => state.application);
  if (!isActionable) {
    return null;
  }
  return (
    <div className="next-steps">
      <h3>Next steps</h3>
      <a className="govuk-button" href={taskLink}>Next steps</a>
      <span className="status-message"></span>
    </div>
  );
}
