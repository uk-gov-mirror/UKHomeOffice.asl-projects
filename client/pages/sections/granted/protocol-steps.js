import React from 'react';
import { Value } from 'slate';
import pick from 'lodash/pick';
import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';

const Step = ({ id, index, fields, ...props }) => {
  const bodyFields = ['adverse-effects', 'prevent-adverse-effects', 'endpoints'];
  return (
    <div className="granted-step" id={id}>
      <div className="header">
        <h2>Step {index + 1} <span className="smaller">({ props.optional ? 'Optional' : 'Mandatory'})</span></h2>
        <Review
          {...fields.find(f => f.name === 'title')}
          label=""
          value={props.title}
        />
      </div>
      <div className="body">
        {
          props.adverse === true
            ? (
              <ReviewFields
                fields={fields.filter(f => bodyFields.includes(f.name))}
                values={pick(props, bodyFields)}
              />
            )
            : (
              <h3>No adverse effects have been noted for this step</h3>
            )
        }
      </div>
      <p className="back-to-top">
        <a href="#step-index">Back to top</a>
      </p>
    </div>
  )
}

const Steps = ({ values, fields }) => {
  const getStepTitle = title => {
    const value = Value.fromJSON(JSON.parse(title));
    return value.document.text && value.document.text !== ''
      ? value.document.text
      : <em>Untitled step</em>
  }

  return (
    <div className="granted-steps">
      <h3 id="step-index">Index of steps</h3>
      <ol>
        {
          values.steps.map(step => (
            <li key={step.id}>
              <a href={`#${step.id}`}>{getStepTitle(step.title)}</a><br />
              <span>{step.optional ? 'Optional' : 'Mandatory'}</span>
            </li>
          ))
        }
      </ol>
      <h3>You may perform these steps in any order</h3>
      {
        values.steps.map((step, index) => <Step key={step.id} {...step} index={index} fields={fields} />)
      }
    </div>
  )
}

export default Steps;
