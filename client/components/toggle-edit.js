import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import isFunction from 'lodash/isFunction';

export default function ToggleEdit({ label, value, values, confirmEdit, children }) {

  const [editable, setEditable] = useState(!value);
  const project = useSelector(state => state.project);

  function triggerEditable(e) {
    e.preventDefault();
    if (isFunction(confirmEdit)) {
      if (confirmEdit(project, values)) {
        return setEditable(true);
      }
      return;
    }
    return setEditable(true);
  }

  if (!editable) {
    return (
      <div className="toggle-edit">
        <div className="govuk-form-group">
          <label className="govuk-label">{label}</label>
          <p>{value} <a href="#" onClick={triggerEditable}>{`Edit ${label.toLowerCase()}`}</a></p>
        </div>
      </div>
    );
  }

  return <div className="toggle-edit">{children}</div>;
}
