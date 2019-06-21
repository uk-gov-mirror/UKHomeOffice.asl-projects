import React, { Component } from 'react';
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
import {superscript, subscript} from 'react-icons-kit/fa/';
import { table2 } from 'react-icons-kit/icomoon';
import Icon from 'react-icons-kit';

class FormatToolbar extends Component {

  hasMark = type => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type == type);
  }

  renderBlockButton = (type, icon) => {
    let isActive = this.query('hasBlock', type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.props;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.query('hasBlock', 'list-item') && parent && parent.type === type;
      }
    }

    if (type === 'input-file') {
      return (
        <label
          className={classnames('fileContainer tooltip-icon-button', {
            active: isActive
          })}
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
      >
        <Icon icon={icon} />
      </button>
    );
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <button
        onClick={event => this.onClickMark(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
      >
        <Icon icon={icon} />
      </button>
    );
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    this.props.emit('toggleMark', type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    this.props.emit('toggleBlock', type)
  }

  onClickImage = event => {
    event.preventDefault();
    this.props.emit('onClickImage', event)
  }

  emit = action => event => {
    event.preventDefault();
    this.props.emit(action);
  }

  query = (...args) => {
    return this.props.query(...args);
  }

  renderTableToolbar() {
    return this.props.inTable
      ? (
        <div className="table-controls">
          <button onClick={this.emit('insertColumn')}>Insert Column</button>
          <button onClick={this.emit('insertRow')}>Insert Row</button>
          <button onClick={this.emit('removeColumn')}>Remove Column</button>
          <button onClick={this.emit('removeRow')}>Remove Row</button>
          <button onClick={this.emit('removeTable')}>Remove Table</button>
        </div>
      )
      : (
        <button className="tooltip-icon-button" onClick={this.emit('insertTable')}>
          <Icon icon={table2} />
        </button>
      )
  }

  render () {
    return (
      <div className="format-toolbar">
        {this.renderMarkButton('bold', ic_format_bold)}
        {this.renderMarkButton('italic', ic_format_italic)}
        {this.renderMarkButton('underlined', ic_format_underlined)}
        {this.renderMarkButton('code', ic_code)}
        {this.renderBlockButton('heading-one', ic_looks_one)}
        {this.renderBlockButton('heading-two', ic_looks_two)}
        {this.renderBlockButton('block-quote', ic_format_quote)}
        {this.renderBlockButton('numbered-list', ic_format_list_numbered)}
        {this.renderBlockButton('bulleted-list', ic_format_list_bulleted)}
        {this.renderBlockButton('input-file', ic_image)}
        {this.renderMarkButton('superscript', superscript)}
        {this.renderMarkButton('subscript', subscript)}
        {this.renderTableToolbar()}
      </div>
    )
  }
}

export default FormatToolbar;
