import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../helpers';
import { DATE_FORMAT } from '../constants';
import RaReasons from './ra-reasons';

export default function RaDetails() {
  const { reasons, project } = useSelector(state => state.application);

  return (
    <div className="ra-details gutter">
      <dl className="inline">
        <dt>Retrospective assessment due</dt>
        <dd>{formatDate(project.raDate, DATE_FORMAT.long)}</dd>

        <dt>Reason for retrospective assessment</dt>
        <dd>
          <RaReasons reasons={reasons} />
        </dd>
      </dl>
    </div>
  )
}
