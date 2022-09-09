import React, { useState } from 'react';
import classnames from 'classnames';
import range from 'lodash/range';
import Fieldset from './fieldset';

// internal state is:
// keywords = {
//   'keyword-0': 'val1',
//   'keyword-1': 'val2',
//   'keyword-2': '',
//   'keyword-3': 'val4',
//   'keyword-4': ''
// }
// which is flattened to ['val1', val2', 'val4'] on save

export default function Keywords(props) {
  const numKeywords = 5;

  function mapKeywords(keywords = []) {
    return range(0, numKeywords).reduce((obj, i) => {
      obj[`keyword-${i}`] = keywords[i];
      return obj;
    }, {});
  }

  function getFields() {
    return range(0, numKeywords).map(i => {
      return {
        name: `keyword-${i}`,
        label: '',
        type: 'text'
      };
    });
  }

  const [keywords, setKeywords] = useState(mapKeywords(props.value));

  function onKeywordChange(key, value) {
    keywords[key] = value.trim();
    setKeywords(keywords);
    props.onChange(Object.values(keywords).filter(Boolean));
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className={classnames('govuk-form-group', 'keywords', { 'govuk-form-group--error': props.error })}>
          <label className="govuk-label" htmlFor={props.name}>{props.label}</label>
          { props.hint && <span id={`${props.name}-hint`} className="govuk-hint">{props.hint}</span> }
          { props.error && <span id={`${props.name}-error`} className="govuk-error-message">{props.error}</span> }
          <Fieldset
            fields={getFields()}
            onFieldChange={onKeywordChange}
            values={keywords}
            noComments={true}
          />
        </div>
      </div>
    </div>
  );
}
