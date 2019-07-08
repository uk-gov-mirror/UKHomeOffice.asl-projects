import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';

export const getConditions = (values, conditions, project) => {
  const customConditions = (values.conditions || [])
    .filter(condition => condition.edited);

  const newConditions = [];
  conditions = map(conditions, (condition, key) => ({ ...condition, key }))

  conditions.forEach(condition => {
    const customCondition = customConditions.find(c => c.key === condition.key);
    const path = `${condition.key}.versions.${condition.versions.length - 1}`;
    if (customCondition) {
      newConditions.push({
        ...customCondition,
        path: condition.path
      })
    } else if (condition.include && condition.include(values, project)) {
      newConditions.push({ key: condition.key, path, type: condition.type });
    }
  });

  return newConditions;
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
  const filterNew = field => field.filter(comment => comment.isNew && comment.author !== user);
  return pickBy(mapValues(comments, filterNew), filterNew);
}

export const flattenReveals = (fields, values) => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options) {
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
