import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

export default ({
  onContinue,
  onExit,
  continueDisabled = false,
  exitDisabled = false,
  advanceLabel = 'Continue',
  exitLabel = 'List of sections'
}) => (
  <p className="control-panel">
    <Button disabled={continueDisabled} onClick={onContinue}>{advanceLabel}</Button>
    <a href="#" disabled={exitDisabled} onClick={onExit}>{exitLabel}</a>
  </p>
)
