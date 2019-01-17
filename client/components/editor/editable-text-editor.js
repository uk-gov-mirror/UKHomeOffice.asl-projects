import React from 'react';
import classnames from 'classnames';
import { Editor } from 'slate-react';
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
import TextEditor from './text-editor';

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

class EditableTextEditor extends TextEditor {
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

export default EditableTextEditor;
