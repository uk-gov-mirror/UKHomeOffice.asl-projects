import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

export default ({
  onContinue,
  onExit,
  continueDisabled = false,
  exitDisabled = false,
  advanceLabel = 'Save and continue',
  exitLabel = 'Save and exit',
  exitClassName = 'button-secondary'
}) => (
  <p className="control-panel">
    <Button disabled={continueDisabled} onClick={onContinue}>{advanceLabel}</Button>
    <Button disabled={exitDisabled} onClick={onExit} className={exitClassName}>{exitLabel}</Button>
  </p>
)
