import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import {
  ic_format_bold,
  ic_format_italic,
  ic_format_underlined,
  ic_code,
  ic_looks_one,
  ic_looks_two,
  ic_format_quote,
  ic_format_list_numbered,
  ic_format_list_bulleted,
  ic_image
} from 'react-icons-kit/md/';
import {
  superscript,
  subscript,
  indent,
  outdent
} from 'react-icons-kit/fa/';
import { table2 } from 'react-icons-kit/icomoon';
import Icon from 'react-icons-kit';

class FormatToolbar extends Component {

  hasMark = type => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type == type);
  }

  renderBlockButton = (type, icon, tooltip) => {
    let isActive = this.props.query('hasBlock', type);

    if (type === 'input-file') {
      return (
        <label
          className={classnames('fileContainer tooltip-icon-button', {
            active: isActive
          })}
          title={tooltip}
        >
          <input type='file' onChange={this.onClickImage} />
          <Icon icon={icon} />
        </label>
      );
    }

    return (
      <button
        onClick={event => this.onClickBlock(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
        title={tooltip}
      >
        <Icon icon={icon} />
      </button>
    );
  }

  renderMarkButton = (type, icon, tooltip) => {
    const isActive = this.hasMark(type);
    return (
      <button
        onClick={event => this.onClickMark(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
        title={tooltip}
      >
        <Icon icon={icon} />
      </button>
    );
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    this.props.command('toggleMark', type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    this.props.command('toggleBlock', type)
  }

  onClickImage = event => {
    event.preventDefault();
    this.props.command('onClickImage', event)
  }

  command = (action, ...args) => event => {
    event.preventDefault();
    this.props.command(action, ...args);
  }

  renderTableToolbar() {
    return this.props.inTable
      ? (
        <div className="table-controls">
          <button onClick={this.command('insertColumn')}>Insert Column</button>
          <button onClick={this.command('insertRow')}>Insert Row</button>
          <button onClick={this.command('removeColumn')}>Remove Column</button>
          <button onClick={this.command('removeRow')}>Remove Row</button>
          <button onClick={this.command('removeTable')}>Remove Table</button>
        </div>
      )
      : (
        <button className="tooltip-icon-button" onClick={this.command('insertTable')} title="Insert table">
          <Icon icon={table2} />
        </button>
      )
  }

  renderListToolbar() {
    const inList = this.props.query('isSelectionInList');
    const inNumbered = this.props.query('isSelectionInList', 'numbered-list');
    const inBulleted = this.props.query('isSelectionInList', 'bulleted-list');

    return (
      <Fragment>
        <button
          className={classnames('tooltip-icon-button', { active: inBulleted })}
          onMouseDown={this.command(inBulleted ? 'unwrapList' : 'wrapInList', 'bulleted-list')}
          title={inBulleted ? 'Remove bulleted list' : 'Bulleted list'}
        >
          <Icon icon={ic_format_list_bulleted} />
        </button>
        <button
          className={classnames('tooltip-icon-button', { active: inNumbered })}
          onMouseDown={this.command(inNumbered ? 'unwrapList' : 'wrapInList', 'numbered-list')}
          title={inNumbered ? 'Remove numbered list' : 'Numbered list'}
        >
          <Icon icon={ic_format_list_numbered} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('decreaseItemDepth')}
          title="Decrease list indent"
        >
          <Icon icon={outdent} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('increaseItemDepth')}
          title="Increase list indent"
        >
          <Icon icon={indent} />
        </button>
      </Fragment>
    );
  }

  render () {
    return (
      <div className="format-toolbar">
        {this.renderMarkButton('bold', ic_format_bold, 'Bold')}
        {this.renderMarkButton('italic', ic_format_italic, 'Italic')}
        {this.renderMarkButton('underlined', ic_format_underlined, 'Underlined')}
        {this.renderMarkButton('code', ic_code, 'Code')}
        {this.renderBlockButton('heading-one', ic_looks_one, 'Heading 1')}
        {this.renderBlockButton('heading-two', ic_looks_two, 'Heading 2')}
        {this.renderBlockButton('block-quote', ic_format_quote, 'Block quote')}
        {this.renderBlockButton('input-file', ic_image, 'Insert image')}
        {this.renderMarkButton('superscript', superscript, 'Superscript')}
        {this.renderMarkButton('subscript', subscript, 'Subscript')}
        {this.renderTableToolbar()}
        {this.renderListToolbar()}
      </div>
    )
  }
}

export default FormatToolbar;
