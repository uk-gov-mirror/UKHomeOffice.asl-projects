import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@ukhomeoffice/react-components';
import NTSWritingTips from './nts-writing-tips';

export default function RAHint() {
  const history = useHistory();

  function redirect() {
    history.push(`?declaration-accepted=true`);
  }

  return (
    <div className="nts">
      <h3>Writing for the public</h3>
      <p>This assessment will be made publicly available and may be read by non-specialists.</p>
      <p>Help them understand your work by describing it as simply and clearly as possible, similarly to how new research might be explained in the media.</p>
      <p>Do not include information that could identify people, places, or intellectual property.</p>

      <NTSWritingTips />
      <Button onClick={redirect}>Continue</Button>
    </div>
  );
}
