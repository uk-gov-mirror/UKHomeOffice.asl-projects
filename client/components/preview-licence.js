import React from 'react';
import { useSelector } from 'react-redux';

export default function NextSteps() {
  const { isActionable, previewLink, asruUser } = useSelector(state => state.application);
  if (!isActionable || !asruUser) {
    return null;
  }

  return (
    <div className="preview-licence">
      <h3>Preview licence</h3>
      <p>Check the licence is correct before granting it</p>
      <a className="govuk-button button-secondary" href={previewLink}>Preview licence</a>
    </div>
  );
}
