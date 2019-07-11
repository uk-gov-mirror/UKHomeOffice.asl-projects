import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { updateAndSave } from '../actions/projects';
import DefaultSection from './sections';
import SectionsLink from '../components/sections-link';
import Header from '../components/header';
import Readonly from './readonly';
import { getSubsections } from '../schema';
import { getConditions } from '../helpers';
import CONDITIONS from '../constants/conditions';

const mapStateToProps = ({ project, application: { schemaVersion, readonly, establishment, isGranted } }, { match: { params } }) => {
  const section = getSubsections(schemaVersion)[params.section];

  section.fields = section.fields || [];

  return {
    project,
    establishment,
    readonly,
    step: parseInt(params.step, 10) || 0,
    section: params.section,
    ...section,
    options: section,
    isGranted
  };
};

const mapDispatchToProps = (dispatch, { onUpdate }) => {
  const update = onUpdate || updateAndSave;
  return {
    update: data => dispatch(update(data))
  };
};

class Section extends React.Component {

  render() {
    if (!this.props.project || isEmpty(this.props.project)) {
      return null;
    }

    if (this.props.readonly) {
      return <Readonly
        establishment={this.props.establishment}
        isGranted={this.props.isGranted}
        project={this.props.project}
        options={this.props.options}
      />
    }

    const Component = this.props.component || DefaultSection;
    const { fields, title, step, section, ...rest } = this.props;

    return (
      <Fragment>
        <SectionsLink />
        <Header
          title={this.props.project.title || 'Untitled project'}
          subtitle={this.props.establishment}
        />
        <Component
          { ...this.props }
          title={ title }
          section={ section }
          save={(data, value) => {
            if (typeof data === 'string') {
              data = { [data]: value };
            }
            const conditions = getConditions({ ...this.props.project, ...data }, CONDITIONS.project);
            return this.props.update({ ...data, conditions });
          }}
          exit={ () => this.props.history.push('/') }
          fields={ fields }
          step={ step }
          { ...rest }
          onProgress={ step => this.props.history.push(`/${this.props.section}/${step}`) }
        />
      </Fragment>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
