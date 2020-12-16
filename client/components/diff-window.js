import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { Value } from 'slate';
import { diffWords, diffSentences, diffArrays } from 'diff';
import pick from 'lodash/pick';
import last from 'lodash/last';
import isEqual from 'lodash/isEqual';
import { Warning } from '@ukhomeoffice/react-components';
import { fetchQuestionVersions } from '../actions/projects';
import { mapSpecies, mapPermissiblePurpose, mapAnimalQuantities } from '../helpers';
import Modal from './modal';
import ReviewField from './review-field'
import Tabs from './tabs';

const DEFAULT_LABEL = 'No answer provided';

const Diff = (props) => {
  const { changes, value } = props;
  const decorateNode = (parts) => {

    return (node) => {
      const decorations = [];
      if (!node.type) {
        let start = 0;

        const getDiffs = text => {
          const length = text.text.length;
          return parts.filter(d => {
            const end = d.start + d.count;
            const startsInside = d.start >= start && d.start < start + length;
            const endsInside = end > start && end <= start + length;
            const wrapsAround = d.start < start && end > start + length;
            return startsInside || endsInside || wrapsAround;
          });
        };

        for (const txt of node.texts()) {
          const [text, path] = txt;
          const localDiffs = getDiffs(text);

          localDiffs.forEach(d => {
            decorations.push({
              type: d.removed ? 'diff-removed' : 'diff',
              data: {
                value: d.value
              },
              anchor: {
                path,
                key: text.key,
                offset: d.start - start
              },
              focus: {
                path,
                key: text.key,
                offset: d.start - start + d.count
              }
            });
          });

          start += text.text.length;
        }

      }

      return decorations;

    };

  }

  const renderDecoration = (props, editor, next) => {
    const { children, decoration, attributes } = props;
    if (decoration.type === 'diff') {
      return <span className="diff" {...attributes}>{ children }</span>;
    }
    if (decoration.type === 'diff-removed') {
      return <span className="diff removed" {...attributes}>{ children }</span>;
    }
    return next();
  }


  const getLabel = item => {
    if (!props.options || !Array.isArray(props.options)) {
      return item;
    }

    const option = props.options.find(opt => opt.value === item);
    return option ? option.label : item;
  };

  switch (props.type) {
    case 'text':
      return (
        <p>
          {
            changes.length
              ? changes.map(({ value, added, removed }, i) => (
                <span key={i} className={classnames({ added, removed, diff: (added || removed) })}>{ value }</span>
              ))
              : <em>{DEFAULT_LABEL}</em>
          }
        </p>
      );

    case 'checkbox':
    case 'permissible-purpose':
    case 'location-selector':
    case 'objective-selector':
    case 'species-selector':
      return changes.length
        ? (
            <ul>
              {
                changes.map(({ value, added, removed }, i) => {
                  return value.map(v => <li key={i}><span className={classnames({ added, removed, diff: (added || removed) })}>{ getLabel(v) }</span></li>)
                })
              }
            </ul>
          )
        : (
          <p>
            <em>{ DEFAULT_LABEL }</em>
          </p>
        );
    case 'animal-quantities':
      if (value === undefined) {
        value = mapAnimalQuantities(project, props.name);
      }
      return (
        <ReviewField
          {...props}
          key={JSON.stringify(changes)}
          name={props.name}
          decorateNode={decorateNode(changes)}
          renderDecoration={renderDecoration}
          type={props.type}
          value={value}
          project={value}
          diff={true}
          noComments
        />
      )
    default:
      return (
        <ReviewField
          {...props}
          key={JSON.stringify(changes)}
          name={props.name}
          decorateNode={decorateNode(changes)}
          renderDecoration={renderDecoration}
          options={props.options}
          type={props.type}
          value={value}
          values={{[props.name]: value}}
          diff={true}
          noComments
        />
      )
  }
}

const Comparison = (props) => {

  const [active, setActive] = useState(0);
  const [changes, setChanges] = useState({ added: [], removed: [] });

  const project = useSelector(state => state.project);
  const loading = useSelector(state => !state.questionVersions[props.name]);
  const { before, previous, changedFromBaseline, changedFromLatest, changedFromGranted } = useSelector(state => {
    if (!state.questionVersions[props.name]) {
      return {
        changedFromLatest: false,
        changedFromBaseline: false
      };
    }
    const { first, previous, granted, grantedId, previousId, firstId } = state.questionVersions[props.name];


    const changedFromGranted = grantedId && !isEqual(granted, props.value);
    const changedFromFirst = firstId && !isEqual(first, props.value);
    const changedFromLatest = grantedId !== previousId && !isEqual(previous, props.value);

    const changedFromBaseline = changedFromGranted || changedFromFirst;
    const baseline = granted || first;
    let before = changedFromBaseline ? baseline : previous;

    if (changedFromLatest && changedFromBaseline) {
      before = active === 0 ? baseline : previous;
    }

    return {
      before,
      previous,
      changedFromLatest,
      changedFromBaseline,
      changedFromGranted
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestionVersions(props.name));
  }, [ props.name ]);

  useEffect(() => {
    if (!loading) {
      const worker = new Worker('/public/js/pages/project-version/read/worker/bundle.js');

      worker.onmessage = msg => {
        console.log(msg.data);
        setChanges(msg.data);
      };

      worker.postMessage({
        before,
        after: props.value,
        props: {
          type: props.type,
          options: props.options,
          project
        }
      });

      setTimeout(() => {
        worker.terminate();
      }, 20000);

      return () => {
        worker.terminate();
      }
    }
    return () => {};
  }, [before,active]);

  const selectTab = (e, active) => {
    e.preventDefault();
    setChanges({ added: [], removed: [] });
    setActive(active);
  }

  const parseValue = (val) => {
    if (typeof val === 'string') {
      val = JSON.parse(val || '{}');
    }
    return Value.fromJSON(val || {});
  }

  const hasContentChanges = (a, b, type) => {
    if (type !== 'texteditor') {
      return true;
    }

    const before = parseValue(a);
    const after = parseValue(b);

    return before.document.text !== after.document.text;
  }

  if (loading) {
    return <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="panel light-grey">
          <p className="loading">Loading comparison</p>
        </div>
      </div>
    </div>
  }

  const baselineLabel = changedFromGranted ? 'Current licence' : 'Initial submission';

  const hasVisibleDiff = hasContentChanges(before, props.value, props.type);

  return <Fragment>
    {
      !hasVisibleDiff && <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <Warning>
            <p>There are no changes to the text in this answer. The changes might include formatting or images.</p>
          </Warning>
        </div>
      </div>
    }
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        {
          changedFromLatest && changedFromBaseline
            ? (
              <Fragment>
                <Tabs active={active}>
                  <a href="#" onClick={e => selectTab(e, 0)}>{ baselineLabel }</a>
                  <a href="#" onClick={e => selectTab(e, 1)}>Previous version</a>
                </Tabs>
                <div className="panel light-grey">
                  <Diff {...props} changes={changes.removed} value={before} key={before + active} />
                </div>
              </Fragment>
            )
            : (
              <Fragment>
                <h3>{changedFromBaseline ? baselineLabel : 'Previous version'}</h3>
                <div className="panel light-grey">
                  <Diff {...props} changes={changes.removed} value={before} key={before + active} />
                </div>
              </Fragment>
            )
        }
      </div>
      <div className="govuk-grid-column-one-half">
        <h3>Proposed</h3>
        <div className="panel light-grey">
          <Diff {...props} changes={changes.added} value={props.value} key={props.value + active} />
        </div>
      </div>
    </div>
  </Fragment>

}

const DiffWindow  = (props) => {

  const { label } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = e => {
    e.preventDefault();
    setModalOpen(!modalOpen);
  }

  return modalOpen
    ? (
      <Modal onClose={ toggleModal }>
        <div className="diff-window">
          <div className="diff-window-header">
            <h1>See what&apos;s changed</h1>
            <a href="#" className="float-right close" onClick={ toggleModal }>Close</a>
          </div>
          <div className="diff-window-body">
            <h2>{ label }</h2>
            <Comparison {...props} />
          </div>
          <div className="diff-window-footer">
            <h3><a href="#" className="float-right close" onClick={ toggleModal }>Close</a></h3>
          </div>
        </div>
      </Modal>
    )
    : <a href="#" className="modal-trigger" onClick={ toggleModal }>See what&apos;s changed</a>
}

export default DiffWindow;
