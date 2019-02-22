import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { updateAndSave } from '../actions/projects';
import DefaultSection from './sections';
import SectionsLink from '../components/sections-link';
import StaticSection from '../components/static-section';
import SideNav from '../components/side-nav';

const mapStateToProps = (state, props) => {
  const section = Object.values(state.application).reduce((found, section) => {
    return found || section.subsections[props.match.params.section];
  }, null);

  section.fields = section.fields || [];

  return {
    project: state.project,
    step: parseInt(props.match.params.step, 10) || 0,
    section: props.match.params.section,
    ...section,
    options: section
  };
};

const mapDispatchToProps = (dispatch, { onUpdate }) => {
  const update = onUpdate || updateAndSave;
  return {
    update: (data, value) => {
      if (typeof data === 'string') {
        return dispatch(update({ [data]: value }));
      }
      return dispatch(update(data));
    }
  };
};

class Section extends React.Component {

  render() {
    if (!this.props.project) {
      return null;
    }

    const Component = this.props.component || DefaultSection;
    const { fields, title, step, section, readonly, options, ...rest } = this.props;

    if (readonly) {
      return (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <SideNav />
          </div>
          <div className="govuk-grid-column-two-thirds">
            <StaticSection section={options} />
          </div>
        </div>
      )
    }

    return (
      <Fragment>
        <SectionsLink />
        <Component
          { ...this.props }
          title={ title }
          section={ section }
          save={ (...args) => this.props.update(...args) }
          exit={ () => this.props.history.push('/') }
          fields={ fields }
          step={ step }
          readonly={ readonly }
          { ...rest }
          onProgress={ step => this.props.history.push(`/${this.props.section}/${step}`) }
        />
      </Fragment>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
