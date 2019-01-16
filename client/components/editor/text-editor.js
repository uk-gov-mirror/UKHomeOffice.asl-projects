import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Block, Value } from 'slate';

import defer from 'lodash/defer';

import { isKeyHotkey } from 'is-hotkey';
import Icon from 'react-icons-kit';
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
import { FormatToolbar } from './index';

const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const getInitialValue = () =>
  Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: ''
                }
              ]
            }
          ]
        }
      ]
    }
  });

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

function isImage(url) {
  // TODO: install imageExtensions
  return !!imageExtensions.find(url.endsWith);
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: 'image',
    data: { src }
  });
}

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph');
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

export default class TextEditor extends Component {
  state = {
    value: this.props.value ? Value.fromJSON(JSON.parse(this.props.value)) : getInitialValue(),
    focus: false
  }

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ value });
    if (!this.props.readonly) this.props.onSave(JSON.stringify(value.toJSON()));
  };

  onFocus = (self, editor, next) => {
    next()
    defer(() => this.setState({ focus: true }))
  }

  onBlur = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: false }));
  }

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <button
        onMouseDown={event => this.onClickMark(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
      >
        <Icon icon={icon} />
      </button>
    );
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
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
        onMouseDown={event => this.onClickBlock(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
      >
        <Icon icon={icon} />
      </button>
    );
  };

  onClickImage = event => {
    event.preventDefault();
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        const src = reader.result;
        // window.alert(src);
        if (!src) return;
        this.editor.command(insertImage, src);
      },
      false
    );

    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  onDropOrPaste = (event, editor, next) => {
    const target = getEventRange(event, editor);
    if (!target && event.type === 'drop') return next();

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type === 'files') {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');
        if (mime !== 'image') continue;

        reader.addEventListener('load', () => {
          editor.command(insertImage, reader.result, target);
        });

        reader.readAsDataURL(file);
      }
      return;
    }

    if (type === 'text') {
      if (!isUrl(text)) return next();
      if (!isImage(text)) return next();
      editor.command(insertImage, text, target);
      return;
    }

    next();
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;
    // console.log('isFocused ' , isFocused);
    // const { attributes, node, isFocused } = props
    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'image': {
        const src = node.data.get('src');
        return <img src={src} {...attributes} selected={isFocused} />;
      }
      default:
        return next();
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  render() {
    return (
      <div
        className={classnames(
          'govuk-form-group',
          { 'govuk-form-group--error': this.props.error },
          this.props.className
        )}
      >
        <label className='govuk-label' htmlFor={this.props.name}>
          {this.props.label}
        </label>
        {this.props.hint && (
          <span id={`${this.props.name}-hint`} className='govuk-hint'>
            {this.props.hint}
          </span>
        )}
        {this.props.error && (
          <span id={`${this.props.name}-error`} className='govuk-error-message'>
            {this.props.error}
          </span>
        )}
        <div className={classnames('editor', { focus: this.state.focus })}>
          <FormatToolbar>
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
          </FormatToolbar>
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            name={this.props.name}
            key={this.props.name}
            schema={schema}
          />
        </div>
      </div>
    );
  }
}
