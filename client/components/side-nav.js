import React, { useEffect, useRef, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import ChangedBadge from './changed-badge';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import classnames from 'classnames';
import SectionLink from './sections-link';
import ExpandingPanel from './expanding-panel';
import schemaMap, { getGrantedSubsections } from '../schema';
import { flattenReveals, getFields } from '../helpers'

const sectionVisible = (section, values) => {
  return !section.show || section.show(values);
}

function getFieldsForSection(section, project) {
  if (section.subsections) {
    return reduce(section.subsections, (arr, subsection) => {
      return [
        ...arr,
        ...getFieldsForSection(subsection, project)
      ];
    }, []);
  }
  return flattenReveals(getFields(section), project).map(field => field.name);
}

const SideNav = ({ schemaVersion, project, isGranted, ...props }) => {
  const nav = useRef(null);

  useEffect(() => {
    if (!isGranted) {
      return () => null;
    }

    nav.current.style.position = 'relative';

    const pos = nav.current.offsetTop;
    const width = nav.current.offsetWidth;
    window.onscroll = () => {
      if (document.documentElement.scrollTop >= pos) {
        nav.current.style.position = 'fixed';
        nav.current.style.width = width + 'px';
      } else {
        nav.current.style.position = 'relative';
      }
    }
    return () => {
      window.onscroll = null;
    }
  });

  const schema = schemaMap[schemaVersion];
  const sections = isGranted
    ? getGrantedSubsections(schemaVersion)
    : schema();
  return (
    <nav ref={nav} className={classnames('sidebar-nav', 'section-nav', { sticky: isGranted })}>
      {
        !isGranted && <SectionLink />
      }
      {
        Object.keys(sections)
          .filter(key => !sections[key].show || sections[key].show(props))
          .filter(key => !isGranted || !sections[key].granted.show || sections[key].granted.show(project))
          .sort((a, b) => !isGranted ? true : sections[a].granted.order - sections[b].granted.order)
          .map(key => {
            const section = sections[key];
            if (section.subsections) {
              const title = <Fragment>
                <ChangedBadge fields={getFieldsForSection(section, project)} noLabel />
                <span className="indent">{section.title}</span>
              </Fragment>
              return (
                <ExpandingPanel key={key} title={title}>
                  {
                    map(pickBy(section.subsections, s => sectionVisible(s, project)), (subsection, key) => {
                      return <p key={key}>
                        <ChangedBadge fields={getFieldsForSection(subsection, project)} noLabel />
                        <NavLink className="indent" to={`/${key}`}>{subsection.title}</NavLink>
                      </p>
                    })
                  }
                </ExpandingPanel>
              )
            }
            return (
              <NavLink key={key} to={`/${key}`}>
                <ChangedBadge fields={getFieldsForSection(section, project)} notLabel />
                <h3>
                  {
                    isGranted
                      ? (section.granted && section.granted.title) || section.title
                      : section.title
                  }
                </h3>
              </NavLink>
            )
          })
      }
    </nav>
  );
}

export default SideNav;
