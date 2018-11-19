import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button } from '@ukhomeoffice/react-components';

import { createProject } from '../actions/projects';
import Field from '../components/field';

const mapStateToProps = state => {
  return {
    fields: state.application.introduction.subsections.details.fields
  };
}
const mapDispatchToProps = dispatch => {
  return {
    create: project => dispatch(createProject(project))
  };
}

class Create extends React.Component {

  componentWillMount() {
    this.setState({ errors: {}, title: '' });
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
      return this.props.create(pick(this.state, fieldNames))
        .then(() => {
          this.props.history.push('/');
        });
    }
  }

  render() {
    return <form onSubmit={e => this.submit(e)}>
      <h1>Create new project</h1>
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
        <Button type="submit">Create</Button>
        <Link to="/">Cancel</Link>
      </p>
    </form>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
