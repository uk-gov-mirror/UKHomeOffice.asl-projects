import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import Table from '../granted/summary-table';
import ReviewField from '../../../components/review-field';
import ProtocolConditions from './protocol-conditions';

function ExpandingRow({ protocol }) {
  return (
    <Fragment>
      <h3>Where this protocol can be carried out</h3>
      <ReviewField
        type="location-selector"
        value={protocol.locations}
      />
      {
        (protocol.steps || []).map((s, index) => (
          <Fragment key={index}>
            <h3>{`Step ${index + 1} (${s.optional ? 'optional' : 'mandatory'})`}</h3>
            <ReviewField
              type="texteditor"
              value={s.title}
            />
          </Fragment>
        ))
      }
    </Fragment>
  );
}

export default function SummaryTable() {
  const project = useSelector(state => state.project);
  const isLegacy = useSelector(state => state.application.project.schemaVersion) === 0;
  const protocols = (project.protocols || []).filter(p => !p.deleted);
  return (
    <Fragment>
      <h1>Protocol summary table</h1>
      <Button onClick={() => window.close()}>Close summary table</Button>
      <ProtocolConditions />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p>A step can be a single procedure or a combination of procedures to achieve an outcome. They should be broadly chronological, with the final step being a method of killing or the last regulated procedure.</p>
        </div>
      </div>
      <Table protocols={protocols} isLegacy={isLegacy} project={project} className="govuk-table protocols-summary" ExpandingRow={ExpandingRow} />
    </Fragment>
  );
}
