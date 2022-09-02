import React from 'react';
import Spinner from './spinner';

export default function HoldingPage() {
  return (
    <div className="holding-page">
      <h1>Your request is being processed</h1>
      <h2>This should only take a few seconds</h2>
      <Spinner />
    </div>
  )
}
