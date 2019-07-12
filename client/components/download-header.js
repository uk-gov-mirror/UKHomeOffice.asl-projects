import React from 'react';

export default ({ title }) => (
  <div className="download-header">
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <h3>{title}</h3>
      </div>
      <div className="govuk-grid-column-one-quarter">
        <a href="pdf" className="download">Download PDF</a>
      </div>
    </div>
  </div>
);
