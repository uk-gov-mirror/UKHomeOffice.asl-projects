import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Input } from '@ukhomeoffice/react-components';

import { createProject } from '../actions/projects';

const mapStateToProps = state => {
  return {};
}
const mapDispatchToProps = dispatch => {
  return {
    create: project => dispatch(createProject(project))
  };
}

class Create extends React.Component {

  componentWillMount() {
    this.setState({ title: '' });
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.state.title) {
      return this.setState({ error: 'Please enter a title' });
    }
    this.props.create({
      title: this.state.title
    }).then(() => {
      this.props.history.push('/');
    });
  }

  render() {
    return <form onSubmit={e => this.onSubmit(e)}>
      <h1>Create new project</h1>
      <Input
        label="Title"
        name="title"
        value={ this.state.title }
        error={ this.state.error }
        onChange={ e => this.setState({ title: e.target.value }) }
        />
      <p className="control-panel"><Button type="submit">Create</Button><Link to="/">Cancel</Link></p>
    </form>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
