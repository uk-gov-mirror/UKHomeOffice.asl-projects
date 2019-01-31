import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames'
import { Button } from '@ukhomeoffice/react-components';

import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';
import { ReviewTextEditor } from '../../../components/editor';

import Review from '../../../components/review-fields';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';

class Step extends Component {
  removeItem = e => {
    e.preventDefault();
    this.props.removeItem();
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

  render() {
    const { prefix, index, fields, values, updateItem, length } = this.props;

    const completed = values.completed;

    return (
      <section className={classnames('step', { completed })}>
        <Fragment>
          {
            completed && (
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
            completed && values.title && <ReviewTextEditor value={values.title} />
          }
        </Fragment>
        {
          !completed
            ? <Fragment>
              <Fieldset
                fields={fields}
                onFieldChange={(key, value) => updateItem({ [key]: value })}
                prefix={`${prefix}steps-${index}-`}
                values={values}
              />
              <Button onClick={() => this.setCompleted(true)}>Save step</Button>
              {
                length > 1 && <Button className="link" onClick={this.removeItem}>Remove step</Button>
              }
            </Fragment>
          : <div className="review">
            <Review fields={fields.filter(f => f.name !== 'title')} values={values} />
            <a href="#" onClick={(e) => this.setCompleted(false, e)}>Edit step</a>
          </div>
        }
      </section>
    )
  }
}

const Steps = ({ values, updateItem, index, name, advance, ...props }) => {
  const prefix = `${name}-${index}-`;
  return (
    <div className="steps">
      <p className="grey">{props.hint}</p>
      <br />
      <Repeater
        type="step"
        items={values.steps}
        onSave={steps => updateItem({ steps })}
        addAnother={every(values.steps, step => step.completed)}
        {...props}
      >
        <Step
          prefix={prefix}
          { ...props }
        />
      </Repeater>
      <Button onClick={advance} className="button-secondary">Next section</Button>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const project = state.projects.find(p => p.id === parseInt(ownProps.match.params.id, 10));
  const values = project.protocols[ownProps.index];
  return {
    values
  }
}

export default connect(mapStateToProps)(Steps);
