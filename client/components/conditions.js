import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button } from '@ukhomeoffice/react-components';
import CONDITIONS from '../constants/conditions';

import Editable from './editable';

class Condition extends Component {
  state = {
    editing: false
  }

  toggleEditing = () => {
    this.setState({ editing: !this.state.editing })
  }

  save = edited => {
    this.submitChange({ edited })
      .then(() => this.setState({ editing: false }))
  }

  cancel = () => {
    this.setState({ editing: false });
  }

  submitChange = data => {
    return this.props.onSave(this.props.id, data)
  }

  revert = () => {
    this.submitChange({ edited: null })
      .then(() => this.setState({ editing: false }))
  }

  restore = () => {
    this.submitChange({ deleted: false })
  }

  remove = () => {
    this.props.remove(this.props.id, this.props.custom);
  }

  render() {
    const { title, deleted, updating, edited, content, custom } = this.props;
    const { editing } = this.state;

    const displayContent = edited || content;

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
                    ? <Editable
                      content={displayContent}
                      edited={!!edited}
                      updating={updating}
                      onSave={this.save}
                      onCancel={this.cancel}
                      onRevert={this.revert}
                      custom={custom}
                    />
                    : (
                      <Fragment>
                        <p className="condition-text">{displayContent}</p>
                        {
                          this.props.editConditions && (
                            <p><Button disabled={updating} className="link" onClick={this.toggleEditing}>Edit</Button> | <Button disabled={updating} className="link" onClick={this.remove}>Remove</Button></p>
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
    adding: false
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
    if (custom) {
      if (window.confirm('Are you sure?')) {
        this.setState({ updating: true })
        return this.props.saveConditions(this.props.conditions.filter(condition => condition.key !== key))
          .then(() => this.setState({ updating: false }))
      }
    } else {
      this.save(key, { deleted: true });
    }
  }

  toggleAdding = () => {
    this.setState({ adding: !this.state.adding });
  }

  addCondition = edited => {
    if (!this.props.editConditions) {
      return;
    }
    this.setState({ updating: true })
    this.props.saveConditions([
      ...this.props.conditions,
      {
        key: `custom-${this.props.conditions.length}`,
        custom: true,
        edited
      }
    ])
      .then(() => {
        this.setState({ adding: false, updating: false })
      });
  }

  render () {
    if (!this.props.showConditions) {
      return null;
    }
    const { conditions, editConditions } = this.props
    const { updating, adding, content } = this.state;

    return (
      <div className="conditions">
        {
          conditions.map(condition => {
            const template = get(CONDITIONS[this.props.type], condition.path, {});
            const { title, content } = template;
            return <Condition
              key={condition.key}
              id={condition.key}
              editConditions={this.props.editConditions}
              updating={updating}
              title={title}
              custom={condition.custom}
              content={content}
              {...condition}
              onSave={this.save}
              remove={this.remove}
            />
          })
        }
        {
          adding
            ? (
              <Editable
                content={content}
                updating={updating}
                onSave={this.addCondition}
                onCancel={this.cancel}
              />
            )
            : editConditions && <Button disabled={updating} className="button-secondary" onClick={this.toggleAdding}>Add another</Button>
        }
      </div>
    )
  }
}

const mapStateToProps = ({
  application: {
    showConditions,
    editConditions
  }
}, {
  conditions = []
}) => ({
  showConditions,
  editConditions,
  conditions: conditions.filter(condition => !condition.inspectorAdded)
});

export default connect(mapStateToProps)(Conditions);
