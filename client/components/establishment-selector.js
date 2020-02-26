import React from 'react';
import Field from './field';
import { useSelector, shallowEqual } from 'react-redux';

export default function EstablishmentSelector(props) {
  const { establishments, canTransfer } = useSelector(state => state.application, shallowEqual);
  if (!canTransfer) {
    return null;
  }
  return (
    <div className="establishment-selector">
      <Field
        {...props}
        type="select"
        options={establishments.map(e => ({ label: e.name, value: e.id }))}
      />
    </div>
  );
}
