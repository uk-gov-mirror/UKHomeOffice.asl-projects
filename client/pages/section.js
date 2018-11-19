import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';

import { Button, Input, Select, TextArea } from '@ukhomeoffice/react-components';

import { updateProject } from '../actions/projects';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === parseInt(props.match.params.id, 10));
  const section = Object.values(state.application).reduce((found, section) => {
    return found || section.subsections[props.match.params.section];
  }, null);

  section.fields = section.fields || [];

  return {
    ...project,
    section
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const id = parseInt(props.match.params.id, 10);
  return {
    update: (data) => dispatch(updateProject(id, data))
  };
};

class Section extends React.Component {

  componentWillMount() {
    this.setState({ errors: {}, ...this.props });
  }

  componentWillReceiveProps(props) {
    this.props.section.fields.forEach(field => {
      this.setState({ [field.name]: props[field.name] });
    });
  }

  submit(e) {
    e.preventDefault();
    const errors = {};
    this.props.section.fields.forEach(field => {
      if (field.required && !this.state[field.name]) {
        errors[field.name] = 'This field is required';
      }
    });
    if (Object.keys(errors).length) {
      return this.setState({ errors });
    }
    const fieldNames = this.props.section.fields.map(f => f.name);
    return this.props.update(pick(this.state, fieldNames))
      .then(() => {
        this.props.history.push(`/project/${this.props.id}`);
      });
  }

  field(field) {
    if (!this.state) {
      return null;
    }
    if (field.type === 'select') {
      return <Select
        key={ field.name }
        name={ field.name }
        label={ field.label }
        options={ field.options }
        value={ this.state[field.name] }
        error={ this.state.errors && this.state.errors[field.name] }
        onChange={ e => this.setState({ [field.name]: e.target.value }) }
        />
    }
    if (field.type === 'textarea') {
      return <TextArea
        key={ field.name }
        name={ field.name }
        label={ field.label }
        value={ this.state[field.name] }
        error={ this.state.errors && this.state.errors[field.name] }
        onChange={ e => this.setState({ [field.name]: e.target.value }) }
        />
    }
    return <Input
      key={ field.name }
      name={ field.name }
      label={ field.label }
      value={ this.state[field.name] }
      error={ this.state.errors && this.state.errors[field.name] }
      onChange={ e => this.setState({ [field.name]: e.target.value }) }
      />
  }

  render() {
    if (!this.props.section) {
      return null;
    }
    if (this.props.section.component) {
      const Section = this.props.section.component;
      return <Section />
    }
    return <form onSubmit={e => this.submit(e)}>
      <h1>{ this.props.section.label }</h1>
      {
        this.props.section.fields.map(field => this.field(field))
      }
      <p className="control-panel">
        <Button type="submit">Save</Button>
        <Link to={`/project/${this.props.id}`}>Cancel</Link>
      </p>
    </form>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
