import flatten from 'lodash/flatten';
import values from 'lodash/values';
import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import dateFormatter from 'date-fns/format';
import LEGACY_SPECIES from '../constants/legacy-species';
import { projectSpecies as SPECIES } from '@asl/constants';
import CONDITIONS from '../constants/conditions';

export const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

export const getConditions = (values, project) => {
  const isProtocol = !!project;

  // remove any old-style conditions from before the days of types
  const previous = (values.conditions || []).filter(Boolean).filter(c => c.type);

  const editedConditions = previous.filter(c => c.autoAdded && c.edited);

  let conditions = isProtocol
    ? CONDITIONS.protocol
    : CONDITIONS.project;

  conditions = map(conditions, (condition, key) => ({ ...condition, key }))

  const newConditions = conditions.map(condition => {
    const editedCondition = editedConditions.find(c => c.key === condition.key);
    const path = `${condition.key}.versions.${condition.versions.length - 1}`;

    if (editedCondition) {
      return { ...editedCondition };
    } else if (condition.include && condition.include(values, project)) {
      return {
        path,
        key: condition.key,
        type: condition.type,
        autoAdded: true
      };
    }
  }).filter(Boolean);

  return [
    // fully custom conditions
    ...previous.filter(c => !c.autoAdded),
    // edited conditions
    ...newConditions
  ];
}

export function mapPermissiblePurpose(project) {
  const values = project['permissible-purpose'] || [];
  const others = project['translational-research'] || [];
  return [
    ...values,
    ...others
  ];
}

export function mapSpecies(project) {
  const species = project.species || [];
  const other = project['species-other'] || [];
  return flatten([
    ...species.map(val => {
      if (val.indexOf('other') > -1) {
        return project[`species-${val}`] || [];
      }
      const item = flatten(values(SPECIES)).find(s => s.value === val);
      return item ? item.label : val;
    }),
    ...other
  ]);
}

export const getScrollPos = (elem, offset = 0) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};

export const getNewComments = (comments, user) => {
  const filterNew = field => field.filter(comment => comment.isNew && comment.author !== user && !comment.deleted);
  return pickBy(mapValues(comments, filterNew), filterNew);
}

export const getLegacySpeciesLabel = species => {
  const matched = LEGACY_SPECIES.find(s => s.value === species.speciesId);
  let label = matched && matched.label;
  if (species.speciesId === '28') {
    label = species['other-species-type'];
  }
  return label;
};

export const flattenReveals = (fields, values) => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options && !item.preserveHierarchy) {
      item.options.forEach(option => {
        if (option.reveal) {
          if (Array.isArray(values[item.name]) && values[item.name].includes(option.value)) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
          else if (option.value === values[item.name]) {
            reveals.push(flattenReveals(castArray(option.reveal), values))
          }
        }
      })
    }
    return flatten([
      ...arr,
      item,
      flatten(reveals)
    ])
  }, []);
};

export function getFields(section) {
  if (section.fields && section.fields.length) {
    return section.fields.map(field => {
      if (field.repeats) {
        return {
          ...field,
          name: `${section.repeats}.*.${field.name}`
        };
      }
      return field;
    });
  }
  else if (section.steps) {
    return flatten(section.steps.map(getFields));
  }
  else return [];
}

/* eslint-disable no-control-regex */
export const stripInvalidXmlChars = text => {
  if (typeof text !== 'string') {
    return text;
  }
  return text.replace(/([^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFC\u{10000}-\u{10FFFF}])/ug, '')
};

// protocol 1, protocol 2 and protocol 3
function getProtocolPart(p, i, protocols) {
  const str = `${p.index + 1}`;
  if (i === protocols.length - 1) {
    return ` and ${str}`
  }
  if (i > 0) {
    return `, ${str}`;
  }
  return str;
}

export const confirmRemove = (protocolRef, singularName, key) => (project, item) => {
  const protocols = (project.protocols || [])
    .map((protocol, index) => ({ ...protocol, index }))
    .filter(protocol => {
      return (protocol[protocolRef] || []).includes(key ? item[key] : item);
    });

  // item doesn't appear in any protocols
  if (!protocols.length) {
    return true;
  }

  let message = `Protocols will be affected\n\nRemoving this ${singularName} will also remove it from`;

  // item appears in all protocols
  if (protocols.length === (project.protocols || []).length) {
    return window.confirm(`${message} all protocols.`)
  }

  const protocolText = protocols.length === 1
    // item appears in a single protocol
    ? `protocol ${protocols[0].index + 1}`
    // item appears in many protocols, list them
    : `protocols ${protocols.map(getProtocolPart).join('')}`
  return window.confirm(`${message} ${protocolText}.`);
};
