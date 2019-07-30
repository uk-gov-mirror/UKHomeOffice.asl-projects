import React, { Component, Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import classnames from 'classnames'
import { Button } from '@ukhomeoffice/react-components';

import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';
import TextEditor from '../../../components/editor';

import ReviewFields from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';

class Step extends Component {
  constructor(options) {
    super(options);
    this.step = createRef();
  }

  removeItem = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this step?')) {
      this.props.removeItem();
    }
  }

  scrollToStep = () => {
    window.scrollTo({
      top: this.step.current.offsetTop,
      left: 0
    })
  }

  saveStep = () => {
    this.setCompleted(true);
    this.scrollToStep();
  }

  setCompleted = (completed, e) => {
    if (e) {
      e.preventDefault();
    }
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
    const { prefix, index, fields, values, updateItem, length, editable } = this.props;

    const completed = !editable || values.completed;

    return (
      <section
        className={classnames('step', { completed, editable })}
        ref={this.step}
      >
        <Fragment>
          {
            editable && completed && (
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
            completed && values.title && <TextEditor value={values.title} readOnly={true} key={values.title} />
          }
        </Fragment>
        {
          !completed
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
            />
            {
              editable && <a href="#" onClick={(e) => this.setCompleted(false, e)}>Edit step</a>
            }
          </div>
        }
      </section>
    )
  }
}

const Steps = ({ values, prefix, updateItem, editable, ...props }) => {
  return (
    <div className="steps">
      <p className="grey">{props.hint}</p>
      <br />
      <Repeater
        type="step"
        singular="step"
        prefix={prefix}
        items={values.steps}
        onSave={steps => updateItem({ steps })}
        addAnother={every(values.steps, step => step.completed)}
        { ...props }
      >
        <Step
          editable={editable}
          { ...props }
        />
      </Repeater>
    </div>
  )
}

const mapStateToProps = ({ project }, { index }) => {
  return {
    values: project.protocols[index]
  }
}

export default withRouter(connect(mapStateToProps)(Steps));
