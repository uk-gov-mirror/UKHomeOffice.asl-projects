import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Value } from 'slate';
import { diffWords, diffSentences, diffArrays } from 'diff';
import last from 'lodash/last';
import { Warning } from '@ukhomeoffice/react-components';
import { fetchQuestionVersions } from '../actions/projects';
import { mapSpecies, mapPermissiblePurpose, mapAnimalQuantities } from '../helpers';
import Modal from './modal';
import ReviewField from './review-field'
import Tabs from './tabs';

const DEFAULT_LABEL = 'No answer provided';

class DiffWindow extends React.Component {
  state = {
    active: 0,
    modalOpen: false
  }

  toggleModal = e => {
    e.preventDefault();
    if (this.props.loading) {
      this.props.getPreviousVersions()
    }
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  selectTab = (e, active) => {
    e.preventDefault();
    this.setState({ active })
  }

  parseValue(val) {
    if (typeof val === 'string') {
      val = JSON.parse(val || '{}');
    }
    return Value.fromJSON(val || {});
  }

  hasContentChanges(a, b, type) {
    if (type !== 'texteditor') {
      return true;
    }

    const before = this.parseValue(a);
    const after = this.parseValue(b);

    return before.document.text !== after.document.text;
  }

  diff(a, b, type) {
    type = type || this.props.type;
    let diff = [];
    let added = [];
    let removed = [];
    let before;
    let after;
    let diffs

    const getLabel = item => {
      const option = this.props.options.find(opt => opt.value === item);
      if (option) {
        return option.label;
      } else {
        const subopt = this.props.options.find(opt => opt.reveal).reveal.options.find(opt => opt.value === item);
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
        diff = diffArrays((a || []).map(getLabel).sort(), mapPermissiblePurpose(this.props.project).map(getLabel).sort());
        break;
      case 'species-selector':
        diff = diffArrays(a || [], mapSpecies(this.props.project));
        break;
      case 'texteditor':

        try {
          before = this.parseValue(a);
          after = this.parseValue(b);
        } catch (e) {
          return { added: [], removed: [] };
        }
        if (before.document.text.length < 5000 && after.document.text.length < 5000) {
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

        return { added, removed };
    }

    return {
      added: diff.filter(item => !item.removed),
      removed: diff.filter(item => !item.added)
    };
  }

  decorateNode(parts) {

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

  renderDecoration(props, editor, next) {
    const { children, decoration, attributes } = props;
    if (decoration.type === 'diff') {
      return <span className="diff" {...attributes}>{ children }</span>;
    }
    if (decoration.type === 'diff-removed') {
      return <span className="diff removed" {...attributes}>{ children }</span>;
    }
    return next();
  }

  renderDiff(parts, value) {
    const getLabel = item => {
      if (!this.props.options || !Array.isArray(this.props.options)) {
        return item;
      }

      const option = this.props.options.find(opt => opt.value === item);
      return option ? option.label : item;
    };

    switch (this.props.type) {
      case 'text':
        return (
          <p>
            {
              parts.length
                ? parts.map(({ value, added, removed }, i) => (
                  <span key={i} className={classnames('diff', { added, removed })}>{ value }</span>
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
        return parts.length
          ? (
              <ul>
                {
                  parts.map(({ value, added, removed }, i) => {
                    return value.map(v => <li key={i}><span className={classnames('diff', { added, removed })}>{ getLabel(v) }</span></li>)
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
          value = mapAnimalQuantities(this.props.project, this.props.name);
        }
        return (
          <ReviewField
            key={value + this.state.active}
            {...this.props}
            name={this.props.name}
            decorateNode={this.decorateNode(parts)}
            renderDecoration={this.renderDecoration}
            type={this.props.type}
            value={value}
            project={value}
            diff={true}
            noComments
          />
        )
      default:
        return (
          <ReviewField
            key={value + this.state.active}
            {...this.props}
            name={this.props.name}
            decorateNode={this.decorateNode(parts)}
            renderDecoration={this.renderDecoration}
            options={this.props.options}
            type={this.props.type}
            value={value}
            values={{[this.props.name]: value}}
            diff={true}
            noComments
          />
        )

    }
  }

  compare() {

    if (this.props.loading) {
      return <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="panel light-grey">
            <p className="loading">Loading comparison</p>
          </div>
        </div>
      </div>
    }

    const { previous, granted, changedFromLatest, changedFromGranted } = this.props;

    let before = changedFromGranted ? granted : previous;

    if (changedFromLatest && changedFromGranted) {
      before = this.state.active === 0 ? granted : previous;
    }

    const changes = this.diff(before, this.props.value);
    const hasContentChanges = this.hasContentChanges(before, this.props.value, this.props.type);

    return <Fragment>
      {
        !hasContentChanges && <div className="govuk-grid-row">
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
            changedFromLatest && changedFromGranted
              ? (
                <Fragment>
                  <Tabs active={this.state.active}>
                    <a href="#" onClick={e => this.selectTab(e, 0)}>Current licence</a>
                    <a href="#" onClick={e => this.selectTab(e, 1)}>Previous version</a>
                  </Tabs>
                  <div className="panel light-grey">
                    {
                      this.renderDiff(changes.removed, before)
                    }
                  </div>
                </Fragment>
              )
              : (
                <Fragment>
                  <h3>{changedFromGranted ? 'Current licence' : 'Previous version'}</h3>
                  <div className="panel light-grey">
                    {
                      this.renderDiff(changes.removed, before)
                    }
                  </div>
                </Fragment>
              )
          }
        </div>
        <div className="govuk-grid-column-one-half">
          <h3>Proposed</h3>
          <div className="panel light-grey">
            {
              this.renderDiff(changes.added, this.props.value)
            }
          </div>
        </div>
      </div>
    </Fragment>
  }

  render() {
    const { modalOpen } = this.state;

    return modalOpen
      ? (
        <Modal onClose={this.toggleModal}>
          <div className="diff-window">
            <div className="diff-window-header">
              <h1>See what&apos;s changed</h1>
              <a href="#" className="float-right close" onClick={this.toggleModal}>Close</a>
            </div>
            <div className="diff-window-body">
              <h2>{this.props.label}</h2>
              { this.compare() }
            </div>
            <div className="diff-window-footer">
              <h3><a href="#" className="float-right close" onClick={this.toggleModal}>Close</a></h3>
            </div>
          </div>
        </Modal>
      )
      : <a href="#" className="modal-trigger" onClick={this.toggleModal}>See what&apos;s changed</a>
  }
}

const mapStateToProps = ({ questionVersions, project }, { name, value }) => {
  if (!questionVersions[name]) {
    return {
      project,
      loading: true,
      changedFromGranted: false,
      changedFromLatest: false
    };
  }
  const { previous, granted, grantedId, previousId } = questionVersions[name];
  return {
    loading: false,
    previous,
    granted,
    project,
    changedFromGranted: grantedId && granted !== value,
    changedFromLatest: grantedId !== previousId && previous !== value
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPreviousVersions: () => dispatch(fetchQuestionVersions(ownProps.name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiffWindow);
