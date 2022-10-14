import React, {Component, createRef, Fragment, useState} from 'react';
import {useParams} from 'react-router';

import classnames from 'classnames';
import {Button, Warning} from '@ukhomeoffice/react-components';

import isUndefined from 'lodash/isUndefined';
import {isEqual, pickBy, uniqBy} from 'lodash';

import ReviewFields from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import NewComments from '../../../components/new-comments';
import ChangedBadge from '../../../components/changed-badge';
import {v4 as uuid} from 'uuid';
import Review from '../../../components/review';
import {getStepTitle, getTruncatedStepTitle, hydrateSteps} from '../../../helpers/steps';
import {saveReusableSteps} from '../../../actions/projects';
import Expandable from '../../../components/expandable';
import cloneDeep from 'lodash/cloneDeep';

function isNewStep(step) {
  return step && (isEqual(Object.keys(step).filter(a => a !== 'addExisting'), ['id']) || !isUndefined(step.addExisting));
}

function renderUsedInProtocols(protocolIndexes) {
  if (protocolIndexes.length < 2) {
    return protocolIndexes;
  }
  return `${protocolIndexes.slice(0, protocolIndexes.length - 1).join(',')} and ${protocolIndexes[protocolIndexes.length - 1]}`;
}

const changeFields = (step, prefix) => step.reusable ? [ `reusableSteps.${step.reusableStepId}` ] : [ prefix.substr(0, prefix.length - 1) ];

class Step extends Component {
  state = {
    expanded: false
  }

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
    this.props.updateItem({ completed: true, existingValues: undefined, addExisting: undefined });
    this.scrollToStep();
  }

  editStep = e => {
    e.preventDefault();
    this.setCompleted(false);
    this.scrollToStep();
  }

  editThisStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: false, reference: `${this.props.values.reference} (edited)`, reusableStepId: uuid(), saved: false, existingValues: cloneDeep(this.props.values) });
    this.scrollToStep();
  }

  editReusableStep = e => {
    e.preventDefault();
    this.props.updateItem({ completed: false, existingValues: cloneDeep(this.props.values) });
    this.scrollToStep();
  }

  cancelItem = e => {
    e.preventDefault();
    this.props.updateItem({ ...(cloneDeep(this.props.values.existingValues)), existingValues: undefined, completed: true });
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

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
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
    const changeFieldPrefix = values.reusableStepId ? `reusableSteps.${values.reusableStepId}.` : this.props.prefix;

    const re = new RegExp(`^steps.${values.id}\\.`);
    const relevantComments = Object.values(
      pickBy(newComments, (value, key) => key.match(re))
    ).reduce((total, comments) => total + (comments || []).length, 0);

    const completed = !editable || values.completed;
    const editingReusableStep = !completed && values.existingValues && values.reusableStepId && values.saved;
    const stepEditable = editingReusableStep ? (values.existingValues.id === values.id) : !completed;

    const stepContent = <>{
      !stepEditable && values.title && (
        <ReviewFields
          fields={[fields.find(f => f.name === 'title')]}
          values={{ title: values.title }}
          prefix={changeFieldPrefix}
          editLink={`0#${this.props.prefix}`}
          protocolId={protocol.id}
          readonly={!isReviewStep}
        />
      )
    }
    {
      stepEditable && !deleted
        ? <Fragment>
          {!editingReusableStep ? <Fieldset
            fields={fields}
            prefix={changeFieldPrefix}
            onFieldChange={(key, value) => updateItem({ [key]: value })}
            values={values}
          /> : <Fragment>
            <Fieldset
              fields={fields.filter(f => f.name !== 'reusable')}
              prefix={changeFieldPrefix}
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
              length > 1 && <Button className="link" onClick={this.removeItem}>{editingReusableStep ? 'Remove this step from this protocol' : 'Remove step'}</Button>
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
            prefix={changeFieldPrefix}
            editLink={`0#${this.props.prefix}`}
            readonly={!isReviewStep}
            protocolId={protocol.id}
          />
          {
            !values.reusable && editable && !deleted && <a href="#" onClick={this.editStep}>Edit step</a>
          }
          {
            values.reusable && editable && !deleted && (<><a href="#" onClick={this.editThisStep}>Edit just this
              step</a> | <a href="#" onClick={this.editReusableStep}>Edit every instance of this step</a></>)
          }
        </div>
    }</>;

    const step = <>
      <section
        className={classnames('step', { completed: !stepEditable, editable })}
        ref={this.step}
      >
        <NewComments comments={relevantComments} />
        <ChangedBadge fields={changeFields(values, changeFieldPrefix)} protocolId={protocol.id} />
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
        </Fragment>
        <EditStepWarning editingReusableStep={editingReusableStep} protocol={protocol} step={values} completed={completed}/>
        {stepContent}
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

    if (isReviewStep) {
      const repeatedFrom = (values.usedInProtocols || []).length > 0 && values.usedInProtocols[0].protocolId !== protocol.id ? values.usedInProtocols[0].protocolNumber : undefined;
      return (
        <section className={'review-step'}>
          <NewComments comments={relevantComments} />
          <ChangedBadge fields={changeFields(values, changeFieldPrefix)} protocolId={protocol.id} />
          <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
            <Fragment>
              <p className={'toggles float-right'}>
                <Button className="link no-wrap" onClick={this.toggleExpanded}>{this.state.expanded ? 'Close' : 'Open'} step</Button>
              </p>
              {values.reference ? <h3 className={'title inline'}>{values.reference}</h3> : <h3 className={'title no-wrap'}>{getStepTitle(values.title)}</h3>}
              <h4 className="light">{values.optional === true ? 'Optional' : 'Mandatory'}{repeatedFrom ? ` - repeated from protocol ${repeatedFrom}` : ''}</h4>
            </Fragment>
            {stepContent}
          </Expandable>
        </section>
      );
    }
    return step;
  }
}

const StepSelector = ({ reusableSteps, values, onSaveSelection, length, onCancel }) => {
  const DEFAULT_STEP_REFERENCE = 'Unnamed step';
  const MAX_CHARACTERS_FROM_TITLE = 80;
  const [selectedSteps, setSelectedSteps] = useState([]);
  const references = {};
  const options = uniqBy(reusableSteps, 'id')
    .map(reusableStep => {
      const reference = reusableStep.reference || getTruncatedStepTitle(reusableStep, MAX_CHARACTERS_FROM_TITLE) || DEFAULT_STEP_REFERENCE;
      const referenceCount = references[reference] || 0;
      references[reference] = referenceCount + 1;
      return {
        label: reference + (referenceCount > 0 ? ' ' + referenceCount : ''),
        value: reusableStep.id
      };
    })
    .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

  const selectStepFields = [{
    name: 'select-steps',
    label: 'Select step',
    type: 'checkbox',
    className: 'smaller',
    options: options
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

const EditStepWarning = ({ editingReusableStep, protocol, step, completed }) => {
  const usedInProtocolIndexes = (protocol, step) =>
    (step.usedInProtocols || [])
      .filter(usedInProtocol => usedInProtocol.protocolId !== protocol.id)
      .map(p => p.protocolNumber);

  if (editingReusableStep) {
    const protocolIndexes = usedInProtocolIndexes(protocol, step);
    const usedInProtocolsMessage = protocolIndexes.length > 0 ? ` The changes will also appear in protocols ${(renderUsedInProtocols(protocolIndexes))}.` : '';
    return (<Warning>{`You are editing all instances of this step.${usedInProtocolsMessage}`}</Warning>);
  } else if (!completed && step.existingValues && !step.saved) {
    const protocolIndexes = usedInProtocolIndexes(protocol, step);
    const usedInProtocolsMessage = protocolIndexes.length > 0 ? `  Changes made to this step will not appear where the '${step.existingValues.reference}' step is reused on protocols ${(renderUsedInProtocols(protocolIndexes))}.` : '';
    return (<Warning>{`You are editing only this instance of this step.${usedInProtocolsMessage}`}</Warning>);
  }
  return null;
};

const StepsRepeater = ({ values, prefix, updateItem, editable, project, isReviewStep, ...props }) => {
  const [ steps, reusableSteps ] = hydrateSteps(props.protocols, values.steps, project.reusableSteps || {});

  const lastStepIsNew = isNewStep(steps[steps.length - 1]);

  return (<Repeater
    type="steps"
    singular="step"
    prefix={prefix}
    items={steps}
    onSave={steps => {
      // Extract reusable steps to save
      // Update reusableSteps on project only when they are complete, or have previously been saved
      const reusableSteps = steps.filter(step => step.reusable && (step.completed || step.saved))
        .map(reusableStep => {
          return { ...reusableStep, id: reusableStep.reusableStepId || reusableStep.id, saved: true };
        });

      const mappedSteps = steps.map(step => {
        if (step.reusable && (step.completed || step.saved)) {
          return { id: step.id, reusableStepId: step.reusableStepId || step.id };
        }
        return step;
      });

      props.dispatch(saveReusableSteps(reusableSteps));
      updateItem({ steps: mappedSteps });
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
  </Repeater>);
};

export default function Steps(props) {
  const isReviewStep = parseInt(useParams().step, 10) === 1;

  if (isReviewStep) {
    return (<StepsRepeater {...props} isReviewStep={isReviewStep} />);
  }

  return (
    <div className="steps">
      <p className="grey">{props.hint}</p>
      <br/>
      <StepsRepeater {...props} isReviewStep={isReviewStep} />
    </div>
  );
}
