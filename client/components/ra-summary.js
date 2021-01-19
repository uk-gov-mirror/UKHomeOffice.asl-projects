import React from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { DATE_FORMAT } from '../constants';

export default function RASummary() {
  const project = useSelector(state => state.application.project);
  return (
    <dl className="inline ra-summary">
      <dt>Retrospective assessment due</dt>
      <dd>{format(project.raDate, DATE_FORMAT.long)}</dd>

      <dt>Reason for retrospective assessment</dt>
      <dd>todo</dd>
    </dl>
  )
}
