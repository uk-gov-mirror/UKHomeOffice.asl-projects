import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';

import { Button } from '@ukhomeoffice/react-components';

import { updateProject } from '../actions/projects';
import Field from '../components/field';

const mapStateToProps = (state, props) => {
  const values = state.projects.find(project => project.id === parseInt(props.match.params.id, 10));
  const section = Object.values(state.application).reduce((found, section) => {
    return found || section.subsections[props.match.params.section];
  }, null);

  section.fields = section.fields || [];

  return {
    id: values.id,
    values,
    ...section
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
    this.setState({ errors: {}, ...this.props.values });
  }

  componentWillReceiveProps(props) {
    this.props.fields.forEach(field => {
      this.setState({ [field.name]: props.values[field.name] });
    });
  }

  validate() {
    const errors = {};
    this.props.fields.forEach(field => {
      if (field.required && !this.state[field.name]) {
        errors[field.name] = 'This field is required';
      }
    });
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  submit(e) {
    e.preventDefault();
    const valid = this.validate();
    if (valid) {
      const fieldNames = this.props.fields.map(f => f.name);
      return this.props.update(pick(this.state, fieldNames))
        .then(() => {
          this.props.history.push(`/project/${this.props.id}`);
        });
    }
  }

  render() {
    if (!this.props.values || !this.state) {
      return null;
    }
    if (this.props.component) {
      const Section = this.props.component;
      return <Section />
    }
    return <form onSubmit={e => this.submit(e)}>
      <h1>{ this.props.label }</h1>
      {
        this.props.fields.map(field => {
          return <Field
            { ...field }
            key={ field.name }
            value={ this.state[field.name] }
            error={ this.state.errors[field.name] }
            onChange={ value => this.setState({ [field.name]: value }) }
            />
        })
      }
      <p className="control-panel">
        <Button type="submit">Save</Button>
        <Link to={`/project/${this.props.id}`}>Cancel</Link>
      </p>
    </form>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
