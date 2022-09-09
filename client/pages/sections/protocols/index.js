import React from 'react';
import Wizard from '../../../components/wizard';
import EditableProtocols from './editable-protocols';
import Review from './review';

export default function Index({ onProgress, step, ...props }) {
  return (
    <div className="protocols-section">
      <h1>Protocols</h1>
      <Wizard onProgress={ step => onProgress(step) } step={ step }>
        <EditableProtocols {...props} editable={true} step={0} />
        <Review {...props} step={1} />
      </Wizard>
    </div>
  );
}
