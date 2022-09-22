import React, {Component, createRef, Fragment, useState} from 'react';
import {useParams} from 'react-router';

import classnames from 'classnames';
import {Button, Warning} from '@ukhomeoffice/react-components';

import isUndefined from 'lodash/isUndefined';
import {isEqual, pickBy, uniqBy, uniq} from 'lodash';

import ReviewFields from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import NewComments from '../../../components/new-comments';
import ChangedBadge from '../../../components/changed-badge';
import {v4 as uuid} from 'uuid';
import Review from '../../../components/review';

function isNewStep(step) {
  return step && isEqual(Object.keys(step).filter(a => a !== 'addExisting'), ['id']);
}

function renderProtocols(values) {
  let usedInProtocols = uniq(values.usedInProtocols || []);
  if (usedInProtocols.length < 2) {
    return usedInProtocols;
  }
  return `${usedInProtocols.slice(0, usedInProtocols.length - 1).join(',')} and ${usedInProtocols[usedInProtocols.length - 1]}`;
}

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
    this.props.updateItem({ completed: true, existingValues: undefined });
    this.scrollToStep();
  }

  editStep = e => {
    e.preventDefault();
    this.setCompleted(false);
    this.scrollToStep();
  }

  editThisStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: false, reference: `${this.props.values.reference} (edited)`, reusableStepId: null, existingValues: this.props.values });
    this.scrollToStep();
  }

  editReusableStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: false, existingValues: this.props.values });
    this.scrollToStep();
  }

  cancelItem = e => {
    e.preventDefault();
    let updateItem = {...this.props.values.existingValues, existingValues: null};
    this.props.updateItem(updateItem);
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
        this.props.updateItem({ completed: false });
      }
    }
  }

  render() {
    const {
      prefix,
      index,
      fields,
      values,
      updateItem,
      parentUpdateItem,
      length,
      editable,
      deleted,
      isReviewStep,
      protocol,
      newComments,
      reusableSteps
    } = this.props;

    const re = new RegExp(`^steps.${values.id}\\.`);
    const relevantComments = Object.values(
      pickBy(newComments, (value, key) => key.match(re))
    ).reduce((total, comments) => total + (comments || []).length, 0);

    const completed = !editable || values.completed;
    let editingReusableStep = !completed && values.existingValues && values.reusableStepId;
    const step = <>
      <section
        className={classnames('step', { completed, editable })}
        ref={this.step}
      >
        <NewComments comments={relevantComments}/>
        <ChangedBadge fields={[prefix.substr(0, prefix.length - 1)]} protocolId={protocol.id}/>
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
              completed && !isUndefined(values.optional) &&
              <span className="light smaller">{` (${values.optional === true ? 'optional' : 'mandatory'})`}</span>
            }
          </h3>
          {
            completed && values.title && (
              <ReviewFields
                fields={[fields.find(f => f.name === 'title')]}
                values={{ title: values.title }}
                prefix={this.props.prefix}
                editLink={`0#${this.props.prefix}`}
                protocolId={protocol.id}
                readonly={!isReviewStep}
              />
            )
          }
        </Fragment>
        {
          editingReusableStep && (<Warning>{`You are editing all instances of this step. The changes will also appear in protocols ${(renderProtocols(values))}.`}</Warning>)
        }
        {
          !completed && values.existingValues && !values.reusableStepId && (<Warning>{`You are editing only this instance of this step. Changes made to this step will not appear where the '${values.existingValues.reference}' step is reused on protocols ${(renderProtocols(values))}.`}</Warning>)
        }
        {
          !completed && !deleted
            ? <Fragment>
              {!(editingReusableStep) ? <Fieldset
                fields={fields}
                prefix={prefix}
                onFieldChange={(key, value) => updateItem({ [key]: value })}
                values={values}
              /> : <Fragment>
                <Fieldset
                  fields={fields.filter(f => f.name !== 'reusable')}
                  prefix={prefix}
                  onFieldChange={(key, value) => updateItem({ [key]: value })}
                  values={values}
                />
                <Review
                  {...fields.find(f => f.name === 'reusable')}
                  value={values.existingValues.reusable}
                  readonly={true}
                  className={'reusable'}
                />
                <Warning>You cannot change this answer when editing all instances of this step.</Warning>
              </Fragment>
              }
              <p className="control-panel">
                <Button onClick={this.saveStep}>Save step</Button>
                {
                  length > 1 && <Button className="link" onClick={this.removeItem}>Remove step</Button>
                }
                {
                  values.existingValues && <Button className="link" onClick={this.cancelItem}>Cancel</Button>
                }
              </p>
            </Fragment>
            : <div className="review">
              <ReviewFields
                fields={fields.filter(f => f.name !== 'title')}
                values={values}
                prefix={this.props.prefix}
                editLink={`0#${this.props.prefix}`}
                readonly={!isReviewStep}
                protocolId={protocol.id}
              />
              {
                !values.reusable && editable && !deleted && <a href="#" onClick={this.editStep}>Edit step</a>
              }
              {
                values.reusable && editable && !deleted && (<><a href="#" onClick={this.editThisStep}>Edit just this step</a> | <a href="#" onClick={this.editReusableStep}>Edit every instance of this step</a></>)
              }
            </div>
        }
      </section>
    </>;

    if (isNewStep(values) && reusableSteps.length > 0) {
      const onSaveSelection = (selectedSteps) => {
        // Replace current step with selected
        const mappedSteps = (this.props.protocol.steps || []).flatMap(step => {
          if (step.id === values.id) {
            return selectedSteps.map(selectedStep => {
              return { id: uuid(), reusableStepId: selectedStep };
            });
          }
          return [step];
        });
        parentUpdateItem({ steps: mappedSteps });
      };

      const fields = [{
        name: 'addExisting',
        label: 'Add step',
        type: 'radio',
        className: 'smaller',
        options: [
          {
            label: 'Create a new step',
            value: false,
            reveal: {
              component: step
            }
          },
          {
            label: 'Select steps used in other protocols',
            value: true,
            reveal: {
              component: <StepSelector reusableSteps={reusableSteps} values={values} onSaveSelection={onSaveSelection} onCancel={this.removeItem} length={length} />
            }
          }
        ],
        inline: false
      }];

      return (<Fragment>
        <Fieldset
          fields={fields}
          prefix={`${values.id}-add-step`}
          onFieldChange={(key, value) => {
            updateItem({ [key]: value });
          }}
          values={values}
        />
      </Fragment>);
    }

    return step;
  }
}

const StepSelector = ({ reusableSteps, values, onSaveSelection, length, onCancel }) => {
  const [selectedSteps, setSelectedSteps] = useState([]);
  const selectStepFields = [{
    name: 'select-steps',
    label: 'Select step',
    type: 'checkbox',
    className: 'smaller',
    options: uniqBy(reusableSteps, 'step.id')
      .map(reusableStep => {
        return {
          label: reusableStep.step.reference,
          value: reusableStep.step.id
        };
      })
  }];
  const saveSelectionHandler = (e) => {
    onSaveSelection(selectedSteps);
  };

  return <Fragment>
    <Fieldset
      fields={selectStepFields}
      prefix={`${values.id}-select-steps`}
      onFieldChange={(key, value) => {
        setSelectedSteps(value);
      }}
      values={values}
    />
    <p className="control-panel">
      <Button className={classnames('block', 'save-selection')} onClick={saveSelectionHandler}>Add steps to protocol</Button>
      {
        length > 1 && <Button className="link" onClick={onCancel}>Cancel</Button>
      }
    </p>
  </Fragment>;
};

export default function Steps({ values, prefix, updateItem, editable, ...props }) {
  const isReviewStep = parseInt(useParams().step, 10) === 1;
  const reusableSteps = (props.protocols || [])
    .flatMap(protocol => (protocol.reusableSteps || [])
      .map((step, index) => {
        return { protocol, step, protocolNumber: index + 1 };
      })
    );

  const reusableStepsInAllProtocols =
    (props.protocols || [])
      .flatMap((protocol, index) => (protocol.steps || [])
        .filter(step => !!step.reusableStepId)
        .map(step => {
          return { reusableStepId: step.reusableStepId, protocolIndex: index + 1 };
        })
      )
      .reduce((map, reusableStep) => {
        if (!map[reusableStep.reusableStepId]) {
          map[reusableStep.reusableStepId] = [];
        }
        map[reusableStep.reusableStepId].push(reusableStep.protocolIndex);
        return map;
      }, {});

  const allReusableStepsById = reusableSteps
    .reduce((map, stepWithProtocol) => {
      map[stepWithProtocol.step.id] = stepWithProtocol;
      return map;
    }, {});

  const steps = (values.steps || []).filter(Boolean)
    .map(step => {
      if (step.reusableStepId) {
        const reusableStep = {...allReusableStepsById[step.reusableStepId]?.step, usedInProtocols: reusableStepsInAllProtocols[step.reusableStepId]};
        return { ...step, ...reusableStep };
      }
      return step;
    });

  const lastStepIsNew = isNewStep(steps[steps.length - 1]);

  return (
    <div className="steps">
      <p className="grey">{props.hint}</p>
      <br/>
      <Repeater
        type="steps"
        singular="step"
        prefix={prefix}
        items={steps}
        onSave={steps => {
          // Extract reusable to own field
          const reusableSteps = steps.filter(step => step.reusable)
            .map(reusableStep => {
              return { ...reusableStep };
            });

          const mappedSteps = steps.map(step => {
            if (step.reusable) {
              return { id: step.id, reusableStepId: step.id };
            }
            return step;
          });

          updateItem({ steps: mappedSteps, reusableSteps });
        }}
        addAnother={!props.pdf && !values.deleted && editable && !lastStepIsNew}
        {...props}
      >
        <Step
          editable={editable}
          deleted={values.deleted}
          isReviewStep={isReviewStep}
          protocol={values}
          reusableSteps={reusableSteps}
          {...props}
          parentUpdateItem={updateItem}
        />
      </Repeater>
    </div>
  );
}
