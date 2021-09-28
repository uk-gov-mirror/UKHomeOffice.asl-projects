import React from 'react';
import Establishments from './establishments';
import Controls from '../../../components/controls';

export default function Index({ advance, exit, ...props }) {
  return (
    <div className="establishments-section">
      <h1>Establishments</h1>
      <Establishments {...props} editable={true} />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  )
}
