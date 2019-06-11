import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import last from 'lodash/last';
import get from 'lodash/get';

import ReactMarkdown from 'react-markdown';
import { updateInspectorConditions, updateRetrospectiveAssessment } from '../../actions/projects';
import CONDITIONS from '../../constants/conditions';
import LEGACY_CONDITIONS from '../../constants/legacy-conditions';
import Field from '../../components/field';
import Fieldset from '../../components/fieldset';
import Editable from '../../components/editable';
import Playback from '../../components/playback';
import ReviewFields from '../../components/review-fields';

class Condition extends Component {
  state = {
    expanded: false,
    editing: false,
    content: this.props.content
  }

  toggleExpanded = e => {
    e.preventDefault();
    this.setState({ expanded: !this.state.expanded })
  }

  toggleEdit = e => {
    e.preventDefault();
    this.setState({ editing: !this.props.editing })
  }

  cancel = () => {
    this.setState({ editing: false })
  }

  save = edited => {
    this.props.onSave(this.props.id, { edited })
      .then(() => this.setState({ editing: false }))
  }

  revert = () => {
    this.props.onSave(this.props.id, { edited: null })
      .then(() => this.setState({ editing: false }))
  }

  render () {
    const { title, id, content, edited, playback, updating, allowEmpty } = this.props;
    const { expanded, editing } = this.state;
    const displayContent = edited || content;
    return (
      <div className="other-legal-condition">
        {title}
        {
          editing
            ? (
              <Editable
                content={displayContent}
                edited={!!edited}
                updating={updating}
                onSave={this.save}
                onCancel={this.cancel}
                onRevert={this.revert}
                showRevert={true}
                allowEmpty={allowEmpty}
              />
            )
            : (
              <Fragment>
                {
                  displayContent && displayContent !== ''
                    ? <ReactMarkdown id={id} className={classnames('light', { clamp: !expanded })}>{displayContent}</ReactMarkdown>
                    : <em>No answer provided</em>
                }
                {
                  playback && <Playback field={playback} />
                }
                <p className="light">
                  <a href="#" className="expand" aria-controls={id} aria-expanded={expanded} onClick={this.toggleExpanded}>{ expanded ? 'Collapse' : 'Expand' }</a>
                  <span> | </span>
                  <a href="#" onClick={this.toggleEdit}>Edit</a>
                </p>
              </Fragment>
            )
        }
      </div>
    )
  }
}

const mapValues = (values, isLegacy) => {
  const conditions = isLegacy ? LEGACY_CONDITIONS : CONDITIONS;

  return Object.keys(conditions.inspector).map(key => {
    const condition = conditions.inspector[key];
    const savedVal = values.find(v => v.key === key);
    if (savedVal) {
      const { title, content } = get(condition, savedVal.path, {});
      return {
        ...savedVal,
        checked: isLegacy || savedVal.checked,
        title,
        content
      };
    }
    const { title, content } = last(condition.versions) || {};
    return {
      key,
      title,
      content,
      checked: condition.checked,
      playback: condition.playback,
      inspectorAdded: true
    }
  })
}

class OtherLegalText extends Component {
  state = {
    conditions: mapValues(this.props.conditions, this.props.isLegacy),
    updating: false,
  }

  onChange = conditions => {
    this.setState({
      conditions: this.state.conditions.map(value => {
        if (conditions.includes(value.key)) {
          return {
            ...value,
            checked: true
          }
        }
        return {
          ...value,
          checked: false
        }
      })
    }, this.persist)
  }

  updateCustom = (key, { edited }) => {
    let { conditions } = this.state;
    if (!conditions.find(condition => condition.key === 'custom')) {
      return new Promise(resolve => {
        this.setState({
          conditions: [
            ...conditions,
            { key: 'custom', edited }
          ]
        }, resolve)
      })
        .then(this.persist);
    }
    return this.save(key, { edited });
  }

  persist = () => {
    this.setState({ updating: true });
    const conditions = this.props.isLegacy ? LEGACY_CONDITIONS : CONDITIONS;
    this.props.saveConditions(
      this.state.conditions
        .filter(value => value.checked || value.edited)
        .map(value => ({
          key: value.key,
          checked: value.checked,
          path: value.key !== 'custom' && `versions[${conditions.inspector[value.key].versions.length - 1}]`,
          edited: value.edited,
          inspectorAdded: true
        }))
    )
      .then(() => this.setState({ updating: false }));
  }

  save = (key, data) => {
    return new Promise(resolve => {
      this.setState({
        conditions: this.state.conditions.map(condition => {
          if (condition.key === key) {
            return {
              ...condition,
              ...data
            }
          }
          return condition
        })
      }, resolve)
    })
      .then(this.persist)
  }

  saveRetro = (key, data) => {
    const values = this.props.values.retrospectiveAssessment;
    this.props.saveRetrospectiveAssessment({
      ...values,
      [key]: data
    })
  }

  render () {
    const { showConditions, isLegacy } = this.props;
    if (!showConditions) {
      return null;
    }
    const { conditions, updating } = this.state;
    return this.props.editConditions
      ? (
        <Fragment>
          <Field
            type="checkbox"
            className="smaller"
            disabled={updating}
            options={conditions.filter(condition => condition.key !== 'custom').map(condition => {
              return {
                value: condition.key,
                label: <Condition
                  {...condition}
                  id={condition.key}
                  onSave={this.save}
                  updating={updating}
                />
              }
            })}
            value={conditions.filter(v => v.checked).map(value => value.key)}
            onChange={this.onChange}
            noComments
          />
          {
            isLegacy && (
              <Fragment>
                <div className="govuk-form-group">
                  <Condition
                    title={<h3>{LEGACY_CONDITIONS.inspector.custom.title}</h3>}
                    updating={updating}
                    id="custom"
                    onSave={this.updateCustom}
                    content={(conditions.find(value => value.key === 'custom') || {}).edited}
                    allowEmpty
                  />
                </div>
                <h2>Retrospective assessment</h2>
                <Fieldset
                  fields={this.props.fields}
                  values={this.props.values.retrospectiveAssessment}
                  onFieldChange={this.saveRetro}
                  noComments
                />
              </Fragment>
            )
          }
        </Fragment>
      )
      : (
        <Fragment>
          {
            conditions.filter(v => v.checked).map((v, index) => (
              <Fragment key={index}>
                {
                  v.title && <h3>{v.title}</h3>
                }
                {
                  isLegacy && v.key === 'custom' && <h3>{LEGACY_CONDITIONS.inspector.custom.title}</h3>
                }
                <ReactMarkdown>{ v.edited || v.content }</ReactMarkdown>
              </Fragment>
            ))
          }
          {
            isLegacy && (
              <Fragment>
                <h2>Retrospective assessment</h2>
                <ReviewFields
                  fields={this.props.fields}
                  values={this.props.values.retrospectiveAssessment || {}}
                  noComments
                />
              </Fragment>
            )
          }
        </Fragment>
      )
  }
}

const mapStateToProps = ({
  project: {
    conditions,
    ...values
  },
  application: {
    showConditions,
    editConditions,
    schemaVersion
  }
}) => {
  return {
    showConditions,
    editConditions,
    isLegacy: schemaVersion === 0,
    conditions: (conditions || []).filter(condition => condition.inspectorAdded),
    values
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveRetrospectiveAssessment: retrospectiveAssessment => dispatch(updateRetrospectiveAssessment(retrospectiveAssessment)),
    saveConditions: conditions => dispatch(updateInspectorConditions(conditions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherLegalText);
