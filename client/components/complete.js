import React, { Component } from 'react';
import { CheckboxGroup, Button } from '@ukhomeoffice/react-components';

class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.complete || false
    }
    this.toggleChecked = this.toggleChecked.bind(this);
    this.emitChange = this.emitChange.bind(this);
  }

  toggleChecked() {
    this.setState({
      checked: !this.state.checked
    });
  }

  emitChange() {
    this.props.onChange(this.state.checked);
  }

  render() {
    const { children, label = 'Mark this protocol as complete' } = this.props;
    return (
      <div className="panel">
        {
          children
        }
        <CheckboxGroup
          label=""
          name="complete"
          className="smaller"
          options={[{
            value: true,
            label
          }]}
          value={this.state.checked}
          onChange={this.toggleChecked}
        />
        <Button onClick={this.emitChange} className="button-secondary">Save and continue</Button>
      </div>
    )
  }
}

export default Complete;
