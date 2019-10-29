import React, { Component, Fragment, createRef } from 'react';
import { useParams } from 'react-router';

import classnames from 'classnames'
import { Button } from '@ukhomeoffice/react-components';

import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';

import ReviewFields from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import ChangedBadge from '../../../components/changed-badge';

class Step extends Component {
  constructor(options) {
    super(options);
    this.step = createRef();
  }

  removeItem = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this step?')) {
      this.scrollToPrevious();
      this.props.removeItem();
    }
  }

  scrollToPrevious = () => {
    const index = this.props.index ? this.props.index - 1 : 0;
    const step = document.querySelectorAll('.steps .step')[index];
    window.scrollTo({
      top: step.offsetTop,
      left: 0
    });
  }

  scrollToStep = () => {
    window.scrollTo({
      top: this.step.current.offsetTop,
      left: 0
    });
  }

  saveStep = e => {
    e.preventDefault();
    this.setCompleted(true);
    this.scrollToStep();
  }

  editStep = e => {
    e.preventDefault();
    this.setCompleted(false);
    this.scrollToStep();
  }

  setCompleted = completed => {
    this.props.updateItem({ completed });
  }

  moveUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveUp();
  }

  moveDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveDown();
  }

  componentDidMount() {
    if (this.props.protocolState && !isUndefined(this.props.protocolState.sectionItem)) {
      const activeStep = this.props.protocolState.sectionItem;
      if (activeStep === this.props.values.id) {
        this.props.updateItem({ completed: false })
      }
    }
  }

  render() {
    const { prefix, index, fields, values, updateItem, length, editable, deleted, isReviewStep } = this.props;

    const completed = !editable || values.completed;
    return (
      <section
        className={classnames('step', { completed, editable })}
        ref={this.step}
      >
        <ChangedBadge fields={[ prefix.substr(0, prefix.length - 1) ]} />
        <Fragment>
          {
            editable && completed && !deleted && (
              <div className="float-right">
                {
                  length > 1 && (
                    <span>Reorder: <a href="#" disabled={index === 0} onClick={this.moveUp}>Up</a> <a href="#" disabled={index + 1 >= length} onClick={this.moveDown}>Down</a></span>
                  )
                }
                {
                  length > 1 && <span> | <a href="#" onClick={this.removeItem}>Remove</a></span>
                }
              </div>
            )
          }
          <h3>
            {`Step ${index + 1}`}
            {
              completed && !isUndefined(values.optional) && <span className="light smaller">{` (${values.optional === true ? 'optional' : 'mandatory'})`}</span>
            }
          </h3>
          {
            completed && values.title && (
              <ReviewFields
                fields={[ fields.find(f => f.name === 'title') ]}
                values={{ title: values.title }}
                prefix={this.props.prefix}
                editLink={`0#${this.props.prefix}`}
                readonly={!isReviewStep}
              />
            )
          }
        </Fragment>
        {
          !completed && !deleted
            ? <Fragment>
              <Fieldset
                fields={fields}
                prefix={prefix}
                onFieldChange={(key, value) => updateItem({ [key]: value })}
                values={values}
              />
              <Button onClick={this.saveStep}>Save step</Button>
              {
                length > 1 && <Button className="link" onClick={this.removeItem}>Remove step</Button>
              }
            </Fragment>
          : <div className="review">
            <ReviewFields
              fields={fields.filter(f => f.name !== 'title')}
              values={values}
              prefix={this.props.prefix}
              editLink={`0#${this.props.prefix}`}
              readonly={!isReviewStep}
            />
            {
              editable && !deleted && <a href="#" onClick={this.editStep}>Edit step</a>
            }
          </div>
        }
      </section>
    )
  }
}

export default function Steps({ values, prefix, updateItem, editable, ...props }) {
  const isReviewStep = parseInt(useParams().step, 10) === 1;
  return (
    <div className="steps">
      <p className="grey">{props.hint}</p>
      <br />
      <Repeater
        type="steps"
        singular="step"
        prefix={prefix}
        items={values.steps}
        onSave={steps => updateItem({ steps })}
        addAnother={!values.deleted && every(values.steps, step => step.completed)}
        { ...props }
      >
        <Step
          editable={editable}
          deleted={values.deleted}
          isReviewStep={isReviewStep}
          { ...props }
        />
      </Repeater>
    </div>
  )
}
