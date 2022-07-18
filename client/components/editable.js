import React, { Component, Fragment } from 'react';
import { TextArea, Button } from '@ukhomeoffice/react-components';
import Reminders from './reminders';

class Editable extends Component {
  state = {
    content: this.props.content,
    reminders: []
  }

  static defaultProps = {
    onChange: () => {}
  }

  onChange = e => {
    const content = e.target.value;
    this.setState({ ...this.state, content }, () => this.props.onChange(this.state));
  }

  onRemindersChange = reminders => {
    this.setState({ ...this.state, reminders }, () => this.props.onChange(this.state));
  }

  save = e => {
    e.preventDefault();
    if ((!!this.state.content && this.state.content !== '' ) || this.props.allowEmpty) {
      this.props.onSave(this.state)
    } else {
      window.alert('Condition/authorisation cannot be empty');
    }
  }

  cancel = e => {
    e.preventDefault();
    if (this.state.content !== this.props.content) {
      if (window.confirm('Are you sure')) {
        this.props.onCancel();
      }
    } else {
      this.props.onCancel();
    }
  }

  revert = e => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      this.props.onRevert();
    }
  }

  render () {
    const { edited, updating, showRevert } = this.props;
    const { content } = this.state;
    const conditionKey = this.props.conditionKey;
    const reminders = this.props.reminders;

    return (
      <Fragment>
        <TextArea
          name="content"
          label=""
          value={content}
          onChange={this.onChange}
          autoExpand={true}
        />

        {
          conditionKey &&
            <Reminders values={reminders} conditionKey={conditionKey} onChange={this.onRemindersChange} />
        }

        <p className="control-panel">
          <Button disabled={updating} onClick={this.save} className="button-secondary">Save</Button>
          <Button disabled={updating} onClick={this.cancel} className="link">Cancel</Button>
          {
            edited && showRevert && <Button disabled={updating} onClick={this.revert} className="link">Revert to default</Button>
          }
        </p>
      </Fragment>
    )
  }
}

export default Editable
