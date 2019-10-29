import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { indexedDBSync, ajaxSync } from '../actions/projects';
import DefaultSection from './sections';
import SectionsLink from '../components/sections-link';
import ErrorBoundary from '../components/error-boundary';
import Readonly from './readonly';
import { getSubsections } from '../schema';
import { getConditions } from '../helpers';
import CONDITIONS from '../constants/conditions';

const mapStateToProps = ({ project, application: { schemaVersion, readonly, establishment, isGranted } }, { match: { params } }) => {
  const section = getSubsections(schemaVersion)[params.section];

  section.fields = section.fields || [];

  return {
    isLegacy: schemaVersion === 0,
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

const mapDispatchToProps = (dispatch, { drafting }) => {
  const update = drafting ? indexedDBSync : ajaxSync;
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
        <ErrorBoundary
          section={true}
          message="Sorry, there is a problem with this section"
          details={`Section: ${this.props.title}`}
        >
          <Component
            { ...this.props }
            title={ title }
            section={ section }
            save={(data, value) => {
              if (typeof data === 'string') {
                data = { [data]: value };
              }

              if (!this.props.isLegacy) {
                const conditions = getConditions({ ...this.props.project, ...data }, CONDITIONS.project);
                this.props.update({ ...data, conditions })
              } else {
                this.props.update(data);
              }
            }}
            exit={ () => this.props.history.push('/') }
            fields={ fields }
            step={ step }
            { ...rest }
            onProgress={ step => this.props.history.push(`/${this.props.section}/${step}`) }
          />
        </ErrorBoundary>
      </Fragment>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
