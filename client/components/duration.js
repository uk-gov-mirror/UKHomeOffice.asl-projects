import React, { Component } from 'react';
import classnames from 'classnames';

import Fieldset from './fieldset'

const getNumbers = length => Array.apply(null, { length }).map(Number.call, String);

class Duration extends Component {
  state = this.props.value || {
    years: null,
    months: null
  }

  UNSAFE_componentWillReceiveProps({ value }) {
    if (value) {
      this.setState(value);
    }
  }

  onChange = (key, value) => {
    value = parseInt(value);
    this.setState({ [key]: value }, () => {
      if (this.state.years === 5) {
        this.setState({ months: 0 }, this.save);
      }
      else {
        this.save()
      }
    });
  }

  save = () => {
    this.props.onChange(this.state);
  }

  getFields = () => {
    return [
      {
        name: 'years',
        label: 'Years',
        type: 'select',
        options: getNumbers(6)
      },
      {
        name: 'months',
        label: 'Months',
        type: 'select',
        options: getNumbers(this.state.years < 5 ? 12 : 1)
      }
    ]
  }

  render() {
    const { error } = this.props;
    return (
      <div className={classnames('govuk-form-group', 'duration', { 'govuk-form-group--error': error })}>
        <label className="govuk-label" htmlFor={this.props.name}>{this.props.label}</label>
        { this.props.hint && <span id={`${this.props.name}-hint`} className="govuk-hint">{this.props.hint}</span> }
        { this.props.error && <span id={`${this.props.name}-error`} className="govuk-error-message">{this.props.error}</span> }
        <Fieldset
          fields={this.getFields()}
          onFieldChange={this.onChange}
          values={this.state}
          noComments={true}
        />
      </div>
    )
  }
}

export default Duration;
