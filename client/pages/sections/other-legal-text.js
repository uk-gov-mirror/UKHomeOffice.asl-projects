import React, { Fragment, Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import last from 'lodash/last';
import get from 'lodash/get';

import ReactMarkdown from 'react-markdown';
import { updateInspectorConditions } from '../../actions/projects';
import CONDITIONS from '../../constants/conditions';
import Field from '../../components/field';
import Editable from '../../components/editable';
import Playback from '../../components/playback';

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
    const { title, id, content, edited, playback, updating } = this.props;
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
              />
            )
            : (
              <Fragment>
                <ReactMarkdown id={id} className={classnames('light', { clamp: !expanded })}>{displayContent}</ReactMarkdown>
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

const mapValues = values => {
  return Object.keys(CONDITIONS.inspector).map(key => {
    const condition = CONDITIONS.inspector[key];
    const savedVal = values.find(v => v.key === key);
    if (savedVal) {
      const { title, content } = get(condition, savedVal.path, {});
      return {
        ...savedVal,
        title,
        content
      };
    }
    const { title, content } = last(condition.versions);
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
    values: mapValues(this.props.values),
    updating: false,
  }

  onChange = values => {
    this.setState({
      values: this.state.values.map(value => {
        if (values.includes(value.key)) {
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

  persist = () => {
    this.setState({ updating: true });
    this.props.saveConditions(
      this.state.values
        .filter(value => value.checked || value.edited)
        .map(value => ({
          key: value.key,
          checked: value.checked,
          path: `versions[${CONDITIONS.inspector[value.key].versions.length - 1}]`,
          edited: value.edited,
          inspectorAdded: true
        }))
    )
      .then(() => this.setState({ updating: false }));
  }

  save = (key, data) => {
    return new Promise(resolve => {
      this.setState({
        values: this.state.values.map(condition => {
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

  render () {
    const { values, updating } = this.state;
    return (
      <Fragment>
        <Field
          type="checkbox"
          className="smaller"
          options={values.map(condition => {
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
          value={values.filter(v => v.checked).map(value => value.key)}
          onChange={this.onChange}
          noComments
        />
      </Fragment>
    )
  }
}

const mapStateToProps = ({ project: { conditions } }) => {
  return {
    conditions,
    values: (conditions || []).filter(condition => condition.inspectorAdded)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveConditions: conditions => dispatch(updateInspectorConditions(conditions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherLegalText);
