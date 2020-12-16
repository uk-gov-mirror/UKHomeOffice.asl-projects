import { Value } from 'slate';
import { diffWords, diffSentences, diffArrays } from 'diff';
import last from 'lodash/last';

const parseValue = (val) => {
  if (typeof val === 'string') {
    val = JSON.parse(val || '{}');
  }
  return Value.fromJSON(val || {});
};

const diff = (a, b, { type, options, project, granularity }) => {

  let diff = [];
  let added = [];
  let removed = [];
  let before;
  let after;
  let diffs

  const getLabel = item => {
    const option = props.options.find(opt => opt.value === item);
    if (option) {
      return option.label;
    } else {
      const subopt = props.options.find(opt => opt.reveal).reveal.options.find(opt => opt.value === item);
      return `(b) ${subopt.label}`;
    }
  }

  switch (type) {
    case 'text':
      diff = diffWords(a || '', b || '');
      break;
    case 'checkbox':
    case 'location-selector':
    case 'objective-selector':
      diff = diffArrays((a || []).sort(), (b || []).sort());
      break;
    case 'permissible-purpose':
      diff = diffArrays((a || []).map(getLabel).sort(), mapPermissiblePurpose(project).map(getLabel).sort());
      break;
    case 'species-selector':
      diff = diffArrays(a || [], mapSpecies(project));
      break;
    case 'texteditor':

      try {
        before = parseValue(a);
        after = parseValue(b);
      } catch (e) {
        return { error: e, added: [], removed: [] };
      }

      if (granularity === 'word') {
        diffs = diffWords(before.document.text, after.document.text);
      } else {
        diffs = diffSentences(before.document.text, after.document.text);
      }

      removed = diffs.reduce((arr, d) => {
        // ignore additions
        if (!d.added) {
          const prev = last(arr);
          const start = prev ? prev.start + prev.count : 0;
          return [...arr, { ...d, start, count: d.value.length }];
        }
        return arr;
      }, []).filter(d => d.removed);

      added = diffs.reduce((arr, d) => {
        // ignore removals
        if (!d.removed) {
          const prev = last(arr);
          const start = prev ? prev.start + prev.count : 0;
          return [...arr, { ...d, start, count: d.value.length }];
        }
        return arr;
      }, []).filter(d => d.added);

      return { added, removed, granularity };
  }

  return {
    added: diff.filter(item => !item.removed),
    removed: diff.filter(item => !item.added),
    granularity
  };
}

onmessage = function (event) {
  const start = Date.now();
  const { before, after, props } = event.data;
  if (props.type === 'texteditor') {
    console.log('Doing sentence diff');
    const sentences = diff(before, after, { ...props, granularity: 'sentence' });
    console.log('Completed sentence diff');
    postMessage({ ...sentences, time: Date.now() - start });
    console.log('Doing word diff');
    const words = diff(before, after, { ...props, granularity: 'word' });
    console.log('Completed word diff');
    postMessage({ ...words, time: Date.now() - start });
  } else {
    postMessage(diff(before, after, props));
  }

};
