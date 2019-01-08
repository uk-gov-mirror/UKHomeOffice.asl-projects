import React, { Component, Fragment } from 'react';

import castArray from 'lodash/castArray';

import { Input, Select, TextArea, RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';
import { TextEditor } from './editor';

import Fieldset from './fieldset';

class Field extends Component {
  constructor(props) {
    super(props);
    this.mapOptions = this.mapOptions.bind(this);
  }

  onChange(value) {
    return this.props.onChange && this.props.onChange(value);
  }

  onSave(value) {
    return this.props.onSave && this.props.onSave(value);
  }

  mapOptions(options = []) {
    return options.map(option => {
      if (!option.reveal) {
        return option;
      }
      return {
        ...option,
        reveal: (
          <div className="govuk-inset-text">
            <Fieldset
              {...this.props}
              fields={castArray(option.reveal)}
            />
          </div>
        )
      }
    })
  }

  render() {
    if (this.props.type === 'select') {
      return <Select
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'radio') {

      return <RadioGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(this.props.options) }
        value={ this.props.value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'checkbox') {
      return <CheckboxGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(this.props.options) }
        value={ this.props.value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          const values = [ ...(this.props.value || []) ];
          if (values.includes(e.target.value)) {
            return this.onChange(values.filter(v => v !== e.target.value));
          }
          this.onChange([ ...values, e.target.value ]);
        }}
        />
    }
    if (this.props.type === 'textarea') {
      return <TextArea
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value || '' }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
      />;
    }
    if (this.props.type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value }
        error={ this.props.error }
        onSave={ value => this.onSave(value) }
      />;
    }
    return <Input
      className={ this.props.className }
      hint={ this.props.hint }
      name={ this.props.name }
      label={ this.props.label }
      value={ this.props.value || '' }
      error={ this.props.error }
      onChange={ e => this.onChange(e.target.value) }
    />;
  }

}

export default Field;
