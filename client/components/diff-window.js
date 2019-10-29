import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Value } from 'slate';
import { diffWords } from 'diff';
import last from 'lodash/last';
import { Warning } from '@ukhomeoffice/react-components';
import { fetchQuestionVersions } from '../actions/projects';
import Modal from './modal';
import ReviewField from './review-field'
import Tabs from './tabs';

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

  hasContentChanges(a, b, type) {
    if (type !== 'text-editor') {
      return true;
    }

    const before = Value.fromJSON(JSON.parse(a || '{}'));
    const after = Value.fromJSON(JSON.parse(b || '{}'));

    return before.document.text !== after.document.text;
  }

  diff(a, b) {
    let before;
    let after;

    try {
      before = Value.fromJSON(JSON.parse(a || '{}'));
      after = Value.fromJSON(JSON.parse(b || '{}'));
    } catch (e) {
      return { added: [], removed: [] };
    }

    const diffs = diffWords(before.document.text, after.document.text);

    const removed = diffs.reduce((arr, d) => {
      // ignore additions
      if (!d.added) {
        const prev = last(arr);
        const start = prev ? prev.start + prev.count : 0;
        return [...arr, { ...d, start, count: d.value.length }];
      }
      return arr;
    }, []).filter(d => d.removed);

    const added = diffs.reduce((arr, d) => {
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

  decorateNode(diff, state) {

    return (node) => {
      const decorations = [];
      if (!node.type) {
        const diffs = state === 'before' ? diff.removed : diff.added;

        let start = 0;

        const getDiffs = text => {
          const length = text.text.length;
          return diffs.filter(d => {
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

  compare() {
    const { previous, granted, changedFromLatest, changedFromGranted } = this.props;

    let before = changedFromGranted ? granted : previous;

    if (changedFromLatest && changedFromGranted) {
      before = this.state.active === 0 ? granted : previous;
    }

    const changes = this.diff(before, this.props.value);
    const hasContentChanges = this.hasContentChanges(before, this.props.value, this.props.type);

    if (this.props.loading) {
      return <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="panel light-grey">
            <p className="loading">Loading comparison</p>
          </div>
        </div>
      </div>
    }

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
                    <ReviewField
                      key={before}
                      decorateNode={this.decorateNode(changes, 'before')}
                      renderDecoration={this.renderDecoration}
                      options={this.props.options}
                      type={this.props.type}
                      value={before}
                      noComments
                    />
                  </div>
                </Fragment>
              )
              : (
                <Fragment>
                  <h3>{changedFromGranted ? 'Current licence' : 'Previous version'}</h3>
                  <div className="panel light-grey">
                    <ReviewField
                      decorateNode={this.decorateNode(changes, 'before')}
                      renderDecoration={this.renderDecoration}
                      options={this.props.options}
                      type={this.props.type}
                      value={before}
                      noComments
                    />
                  </div>
                </Fragment>
              )
          }
        </div>
        <div className="govuk-grid-column-one-half">
          <h3>Proposed</h3>
          <div className="panel light-grey">
            <ReviewField
              key={before}
              decorateNode={this.decorateNode(changes, 'after')}
              renderDecoration={this.renderDecoration}
              options={this.props.options}
              type={this.props.type}
              value={this.props.value}
              noComments
            />
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

const mapStateToProps = ({ questionVersions }, { name, value }) => {
  if (!questionVersions[name]) {
    return {
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
