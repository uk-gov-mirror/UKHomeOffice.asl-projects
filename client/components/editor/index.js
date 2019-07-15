import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import ReactMarkdown from 'react-markdown'

import defer from 'lodash/defer';
import debounce from 'lodash/debounce';

import { throwError } from '../../actions/messages';

import FormatToolbar from './format-toolbar';
import initialValue from './initial-value'
import Blocks from './blocks';
import Marks from './marks';
import Image from './image';
import Table from './table';

const tablePlugin = Table();

const plugins = [
  Blocks(),
  Marks(),
  Image(),
  tablePlugin
]

class TextEditor extends Component {
  constructor(props) {
    super(props);
    let value = this.props.value;
    if (value) {
      try {
        value = JSON.parse(this.props.value)
      } catch(e) {
        value = initialValue(value);
      }
    } else {
      value = initialValue('');
    }

    this.state = {
      value: Value.fromJSON(value),
      focus: false
    }
  }

  ref = editor => {
    this.editor = editor;
  };

  save = () => {
    const { value } = this.state;
    const jsonVal = JSON.stringify(value.toJSON())
    const notNull = jsonVal !== JSON.stringify(Value.fromJSON(initialValue('')));
    this.props.onChange(notNull ? jsonVal : null)
  }

  onChange = ({ value }) => {
    this.setState({ value }, debounce(this.save, 500, { maxWait: 5000 }));
  };

  onFocus = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: true }));
  };

  onBlur = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: false }));
  };

  command = (func, ...args) => {
    try {
      this.editor[func] && this.editor[func](...args)
    } catch (err) {
      this.props.throwError(err.message);
    }
  }

  query = (func, ...args) => {
    if (!this.editor) {
      return false;
    }
    if (!this.editor[func]) {
      throw new Error(`Query "${func}" is not defined`)
    }
    return this.editor[func](...args)
  }

  render() {
    const { value } = this.state;
    return (
      <div
        className={classnames(
          'govuk-form-group',
          { 'govuk-form-group--error': this.props.error },
          this.props.className
        )}
      >
        {
          !this.props.readOnly && (
            <Fragment>
              <label className='govuk-label' htmlFor={this.props.name}>
                {this.props.label}
              </label>
              {
                this.props.hint && (
                  <span id={`${this.props.name}-hint`} className='govuk-hint'>
                    <ReactMarkdown source={this.props.hint} />
                  </span>
                )
              }
              {
                this.props.error && (
                  <span id={`${this.props.name}-error`} className='govuk-error-message'>
                    {this.props.error}
                  </span>
                )
              }
            </Fragment>
          )
        }
        <div id={this.props.name} className={classnames('editor', { focus: this.state.focus, readonly: this.props.readOnly })}>
          {
            !this.props.readOnly && (
              <FormatToolbar
                value={this.state.value}
                inTable={tablePlugin.queries.isSelectionInTable(value)}
                query={this.query}
                emit={this.command}
              />
            )
          }
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            plugins={plugins}
            value={value}
            onChange={this.onChange}
            name={this.props.name}
            key={this.props.name}
            readOnly={this.props.readOnly}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    throwError: message => dispatch(throwError(message))
  };
}

export default connect(null, mapDispatchToProps)(TextEditor);
