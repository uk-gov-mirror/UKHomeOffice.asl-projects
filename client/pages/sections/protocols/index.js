import React from 'react';
import Wizard from '../../../components/wizard'
import EditableProtocols from './editable-protocols';
import Review from './review';

const Index = ({ onProgress, step, ...props }) => (
  <div className="protocols-section">
    <h1>Protocols</h1>
    <Wizard onProgress={ step => onProgress(step) } step={ step }>
      <EditableProtocols {...props} editable={true} step={0} />
      <Review {...props} step={1} />
    </Wizard>
  </div>
);

export default Index;
