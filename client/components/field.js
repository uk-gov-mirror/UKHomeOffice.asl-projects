import { Input, Select, TextArea, RadioGroup } from '@ukhomeoffice/react-components';

import React from 'react';

class Field extends React.Component {

  onChange(value) {
    return this.props.onChange && this.props.onChange(value);
  }

  render() {
    if (this.props.type === 'select') {
      return <Select
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
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'textarea') {
      return <TextArea
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    return <Input
      name={ this.props.name }
      label={ this.props.label }
      value={ this.props.value }
      error={ this.props.error }
      onChange={ e => this.onChange(e.target.value) }
      />
  }

}

export default Field;

