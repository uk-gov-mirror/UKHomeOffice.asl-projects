import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import SectionLink from './sections-link';
import ExpandingPanel from './expanding-panel';

const sectionVisible = (section, values) => {
  return !section.show || section.show(values);
}

const SideNav = ({ application, project }) => (
  <nav className="sidebar-nav section-nav">
    <SectionLink />
    {
      map(application, (section, key) =>
        <ExpandingPanel key={key} title={section.title}>
          {
            map(pickBy(section.subsections, s => sectionVisible(s, project)), (subsection, key) => {
              return <p key={key}><Link to={`/${key}`}>{subsection.title}</Link></p>
            })
          }
        </ExpandingPanel>
      )
    }
  </nav>
)

const mapStateToProps = ({ application, project }) => ({ application, project })

export default connect(mapStateToProps)(SideNav);
