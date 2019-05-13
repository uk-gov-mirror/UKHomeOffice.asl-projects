import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button } from '@ukhomeoffice/react-components';
import CONDITIONS from '../constants/conditions';
import Field from './field';

class Condition extends Component {

  state = {
    editing: !this.props.edited && !this.props.content,
    content: this.props.edited || this.props.content
  }

  toggleEditing = () => {
    this.setState({ editing: !this.state.editing })
  }

  onChange = content => {
    this.setState({ content })
  }

  save = () => {
    this.submitChange({ edited: this.state.content })
      .then(() => this.setState({ editing: false }))
  }

  reset = () => {
    const hasChanged = this.state.content !== (this.props.edited || this.props.content);
    if (hasChanged) {
      if (window.confirm('Are you sure')) {
        this.submitChange({ edited: this.props.edited })
          .then(() => this.setState({ editing: false }))
      }
    } else {
      this.setState({ editing: false });
    }
  }

  submitChange = data => {
    return this.props.onSave(data)
  }

  revert = () => {
    if (window.confirm('Are you sure')) {
      this.submitChange({ edited: null })
        .then(() => this.setState({ editing: false }))
    }
  }

  restore = () => {
    this.submitChange({ deleted: false })
  }

  render() {
    const { title, deleted, updating, edited } = this.props;
    const { editing, content } = this.state;

    return (
      <div className={classnames('condition', { deleted })}>
        <h3>{title}</h3>
        {
          deleted
            ? (
              <Fragment>
                <em>This authorisation/condition has been removed</em>
                <p>
                  <Button disabled={updating} className="link" onClick={this.restore}>Restore</Button>
                </p>
              </Fragment>
            )
            : (
              <Fragment>
                {
                  editing && this.props.editConditions
                    ? (
                      <Fragment>
                        <Field
                          type="textarea"
                          value={content}
                          onChange={this.onChange}
                          noComments
                        />
                        <p className="control-panel">
                          <Button disabled={updating} onClick={this.save}>Save</Button>
                          <Button disabled={updating} onClick={this.reset} className="link">Cancel</Button>
                          {
                            edited && <Button disabled={updating} onClick={this.revert} className="link">Revert to default</Button>
                          }
                        </p>
                      </Fragment>
                    )
                    : (
                      <Fragment>
                        <p className="condition-text">{content}</p>
                        {
                          this.props.editConditions && (
                            <p><Button disabled={updating} className="link" onClick={this.toggleEditing}>Edit</Button> | <Button disabled={updating} className="link" onClick={this.props.remove}>Remove</Button></p>
                          )
                        }
                      </Fragment>
                    )
                }
              </Fragment>
            )
        }
      </div>
    )
  }
}

class Conditions extends Component {

  state = {
    updating: false,
    adding: false,
    content: ''
  }

  save = (key, data) => {
    if (!this.props.editConditions) {
      return;
    }
    this.setState({ updating: true });
    const conditions = this.props.conditions.map(condition => {
      if (condition.key === key) {
        return {
          ...condition,
          ...data
        }
      }
      return condition;
    })
    return this.props.saveConditions(conditions)
      .then(() => this.setState({ updating: false }))
  }

  remove = (key, custom) => {
    if (!this.props.editConditions) {
      return;
    }
    if (custom && window.confirm('Are you sure?')) {
      this.setState({ updating: true })
      return this.props.saveConditions(this.props.conditions.filter(condition => condition.key !== key))
        .then(() => this.setState({ updating: false }))
    }
    this.save(key, { deleted: true });
  }

  toggleAdding = () => {
    this.setState({ adding: !this.state.adding });
  }

  updateNewCondition = content => {
    this.setState({ content });
  }

  addCondition = () => {
    if (!this.props.editConditions) {
      return;
    }
    this.setState({ updating: true })
    this.props.saveConditions([
      ...this.props.conditions,
      {
        key: `custom-${this.props.conditions.length}`,
        custom: true,
        content: this.state.content
      }
    ])
      .then(() => {
        this.setState({ adding: false, content: '', updating: false })
      });
  }

  render () {
    if (!this.props.showConditions) {
      return null;
    }
    const { conditions = [], editConditions } = this.props
    const { updating, adding, content } = this.state;

    return (
      <div className="conditions">
        {
          conditions.map(condition => {
            const template = get(CONDITIONS[this.props.type], condition.path, {});
            const { title, content } = template;
            return <Condition
              key={condition.key}
              editConditions={this.props.editConditions}
              updating={updating}
              title={title}
              content={content}
              {...condition}
              onSave={data => this.save(condition.key, data)}
              remove={() => this.remove(condition.key, condition.custom)}
            />
          })
        }
        {
          adding
            ? (
              <Fragment>
                <Field
                  type="textarea"
                  value={content}
                  onChange={this.updateNewCondition}
                  noComments
                />
                <p>
                  <Button disabled={updating} onClick={this.addCondition}>Save</Button>
                </p>
              </Fragment>
            )
            : editConditions && <Button disabled={updating} className="button-secondary" onClick={this.toggleAdding}>Add another</Button>
        }
      </div>
    )
  }
}

const mapStateToProps = ({ application: { showConditions, editConditions } }) => ({ showConditions, editConditions })

export default connect(mapStateToProps)(Conditions);
