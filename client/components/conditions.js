import React, { Fragment, Component, PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Button, TextArea } from '@ukhomeoffice/react-components';
import CONDITIONS from '../constants/conditions';

class Condition extends PureComponent {

  state = {
    editing: !this.props.edited && !this.props.content,
    content: this.props.edited || this.props.content
  }

  toggleEditing = () => {
    this.setState({ editing: !this.state.editing })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.content !== this.props.content || newProps.edited !== this.props.edited) {
      this.setState({ content: newProps.edited || newProps.content });
    }
  }

  onChange = e => {
    const content = e.target.value;
    this.setState({ content })
  }

  save = () => {
    if (!!this.state.content && this.state.content !== '') {
      this.submitChange({ edited: this.state.content })
        .then(() => this.setState({ editing: false }))
    } else {
      window.alert('No changes made');
    }
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
    return this.props.onSave(this.props.id, data)
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

  remove = () => {
    this.props.remove(this.props.id, this.props.custom);
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
                        <TextArea
                          type="textarea"
                          value={content}
                          onChange={this.onChange}
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

  updateNewCondition = e => {
    const content = e.target.value;
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
              <Fragment>
                <TextArea
                  type="textarea"
                  value={content}
                  onChange={this.updateNewCondition}
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

const mapStateToProps = ({ application: { showConditions, editConditions } }, { conditions = [] }) => ({ showConditions, editConditions, conditions });

export default connect(mapStateToProps)(Conditions);
