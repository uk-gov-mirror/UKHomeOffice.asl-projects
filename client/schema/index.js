import pickBy from 'lodash/pickBy';
import isUndefined from 'lodash/isUndefined';

import v0 from './v0';
import v1 from './v1';

const versions = {
  0: v0,
  1: v1
};

export function getGrantedSubsections(schemaVersion) {
  return Object.values(versions[schemaVersion])
    .reduce((sections, section) => {
      return {
        ...sections,
        ...pickBy(section.subsections, subsection => {
          return !isUndefined(subsection.granted)
        })
      };
    }, {});
}

export function getSubsections(schemaVersion) {
  return Object.values(versions[schemaVersion])
    .reduce((sections, section) => {
      return {
        ...sections,
        ...(section.subsections || {})
      };
    }, {});
}

export default versions;
