import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { updateProject } from '../actions/projects';

const mapStateToProps = (state, props) => {
  const values = state.projects.find(project => project.id === parseInt(props.match.params.id, 10));
  const section = Object.values(state.application).reduce((found, section) => {
    return found || section.subsections[props.match.params.section];
  }, null);

  section.fields = section.fields || [];

  return {
    id: props.match.params.id,
    step: parseInt(props.match.params.step, 10) || 0,
    section: props.match.params.section,
    values,
    ...section
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const id = parseInt(props.match.params.id, 10);
  return {
    update: (data, value) => {
      if (typeof data === 'string') {
        return dispatch(updateProject(id, { [data]: value }));
      }
      return dispatch(updateProject(id, data));
    }
  };
};

class Section extends React.Component {

  render() {
    if (this.props.component) {
      const Section = this.props.component;
      return <Section
        title={ this.props.title }
        save={ (...args) => this.props.update(...args) }
        exit={ () => this.props.history.push(`/project/${this.props.id}`) }
        values={ this.props.values }
        fields={ this.props.fields }
        step={ this.props.step }
        onProgress={ step => this.props.history.push(`/project/${this.props.id}/${this.props.section}/${step}`) }
        />
    }
    return <Fragment>
      <h1>{ this.props.label }</h1>
    </Fragment>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
