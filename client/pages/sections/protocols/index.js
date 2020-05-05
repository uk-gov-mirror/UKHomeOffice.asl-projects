import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Wizard from '../../../components/wizard'
import EditableProtocols from './editable-protocols';
import Review from './review';

export default function Index({ onProgress, step, ...props }) {
  const isLegacy = useSelector(state => state.application.project.schemaVersion) === 0;
  return (
    <div className="protocols-section">
      <h1>Protocols</h1>
      {
        !isLegacy && <Link to="/protocol-summary" target="_blank">View summary table</Link>
      }
      <Wizard onProgress={ step => onProgress(step) } step={ step }>
        <EditableProtocols {...props} editable={true} step={0} />
        <Review {...props} step={1} />
      </Wizard>
    </div>
  );
}
