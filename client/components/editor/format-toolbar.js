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
  ic_image,
  ic_format_clear
} from 'react-icons-kit/md/';
import {
  superscript,
  subscript,
  indent,
  outdent
} from 'react-icons-kit/fa/';
import { table2 } from 'react-icons-kit/icomoon';
import Icon from 'react-icons-kit';

const SizedIcon = props => <Icon size="24" {...props} />;

class FormatToolbar extends Component {

  hasMark = type => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type == type);
  }

  renderBlockButton = (type, icon, tooltip) => {
    let isActive = this.props.query('hasBlock', type);

    if (type === 'input-file') {
      return (
        <button
          className={classnames('tooltip-icon-button', { active: isActive })}
          title={tooltip}
          aria-label={tooltip}
          tabIndex={-1}
        >
          <input
            type='file'
            onChange={this.onClickImage}
            aria-label={tooltip}
          />
          <SizedIcon icon={icon} />
        </button>
      );
    }

    return (
      <button
        onClick={event => this.onClickBlock(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
        title={tooltip}
        aria-label={tooltip}
      >
        <SizedIcon icon={icon} />
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
        aria-label={tooltip}
      >
        <SizedIcon icon={icon} />
      </button>
    );
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    this.props.command('toggleMark', type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    this.props.command('toggleBlock', type);
  }

  onClickImage = event => {
    event.preventDefault();
    this.props.command('onClickImage', event);
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
        <button
          className="tooltip-icon-button"
          onClick={this.command('insertTable')}
          title="Insert table"
          aria-label="Insert table"
        >
          <SizedIcon icon={table2} />
        </button>
      );
  }

  renderListToolbar() {
    const inList = this.props.query('isSelectionInList');
    const inNumbered = this.props.query('isSelectionInList', 'numbered-list');
    const inBulleted = this.props.query('isSelectionInList', 'bulleted-list');

    const toggleBulletedLabel = inBulleted ? 'Remove bulleted list' : 'Bulleted list';
    const toggleNumberedLabel = inNumbered ? 'Remove numbered list' : 'Numbered list';

    return (
      <Fragment>
        <button
          className={classnames('tooltip-icon-button', { active: inBulleted })}
          onMouseDown={this.command(inBulleted ? 'unwrapList' : 'wrapInList', 'bulleted-list')}
          title={toggleBulletedLabel}
          aria-label={toggleBulletedLabel}
        >
          <SizedIcon icon={ic_format_list_bulleted} />
        </button>
        <button
          className={classnames('tooltip-icon-button', { active: inNumbered })}
          onMouseDown={this.command(inNumbered ? 'unwrapList' : 'wrapInList', 'numbered-list')}
          title={toggleNumberedLabel}
          aria-label={toggleNumberedLabel}
        >
          <SizedIcon icon={ic_format_list_numbered} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('decreaseItemDepth')}
          title="Decrease list indent"
          aria-label="Decrease list indent"
        >
          <SizedIcon icon={outdent} />
        </button>
        <button
          className="tooltip-icon-button"
          disabled={!inList}
          onMouseDown={this.command('increaseItemDepth')}
          title="Increase list indent"
          aria-label="Increase list indent"
        >
          <SizedIcon icon={indent} />
        </button>
      </Fragment>
    );
  }

  clearFormatting = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear formatting in selection?')) {
      this.props.command('unwrapBlocks');
      this.props.command('clearMarks');
    }
  }

  renderClearFormattingButton() {
    return <button
      className="tooltip-icon-button"
      onMouseDown={this.clearFormatting}
      title="Clear formatting"
      aria-label="Clear formatting"
    >
      <SizedIcon icon={ic_format_clear} />
    </button>;
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
        {this.renderListToolbar()}
        {this.renderClearFormattingButton()}
        {this.renderTableToolbar()}
      </div>
    );
  }
}

export default FormatToolbar;
