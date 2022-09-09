import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { indexedDBSync, ajaxSync } from '../actions/projects';
import DefaultSection from './sections';
import SectionsLink from '../components/sections-link';
import ErrorBoundary from '../components/error-boundary';
import StaticSection from '../components/static-section';
import RaSidePanel from '../components/ra-side-panel';
import RAHint from '../components/ra-hint';
import Readonly from './readonly';
import { getSubsections } from '../schema';

const mapStateToProps = (
  {
    project,
    application: {
      schemaVersion,
      readonly,
      establishment,
      isGranted,
      project: actualProject
    }
  },
  {
    match: {
      params
    }
  }
) => {
  const section = getSubsections(schemaVersion)[params.section];

  section.fields = section.fields || [];

  return {
    isLegacy: schemaVersion === 0,
    isRa: schemaVersion === 'RA',
    project,
    establishment,
    readonly,
    step: parseInt(params.step, 10) || 0,
    section: params.section,
    ...section,
    options: section,
    isGranted,
    actualProject
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
      />;
    }

    if (this.props.actualProject.isLegacyStub && this.props.section === 'additional-conditions') {
      return <StaticSection section={this.props.options} { ...rest } />;
    }

    const Component = this.props.component || DefaultSection;
    const { fields, title, step, section, ...rest } = this.props;

    return (
      <Fragment>
        <SectionsLink />
        {
          this.props.isRa && <RAHint />
        }
        <div className="govuk-grid-row">
          <div className={`govuk-grid-column-${this.props.isRa ? 'two-thirds' : 'full'}`}>
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
                  this.props.update(data);
                }}
                exit={ () => this.props.history.push('/') }
                fields={ fields }
                step={ step }
                { ...rest }
                onProgress={ step => this.props.history.push(`/${this.props.section}/${step}`) }
              />
            </ErrorBoundary>
          </div>
          {
            this.props.isRa && (
              <div className="govuk-grid-column-one-third">
                <RaSidePanel />
              </div>
            )
          }
        </div>
      </Fragment>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
