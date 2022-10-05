import React from 'react';
import { useSelector } from 'react-redux';

export default function NextSteps() {
  const { isActionable, taskLink, project } = useSelector(state => state.application);
  if (!isActionable) {
    return null;
  }

  const isApplication = project.status === 'inactive';
  let type = isApplication
    ? 'application'
    : 'amendment';

  return (
    <div className="next-steps">
      <h3>Next steps</h3>
      <p><span>Review the next steps for this {type}</span></p>
      <a className="govuk-button" href={taskLink}>Continue</a>
      <span className="status-message"></span>
    </div>
  );
}
