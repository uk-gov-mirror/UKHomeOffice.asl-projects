import React from 'react';
import { Editor } from 'slate-react';
import TextEditor from './text-editor';

class ReviewTextEditor extends TextEditor {
  render() {
    return (
      <div className='editor readonly'>
        <Editor
          value={this.state.value}
          renderMark={this.renderMark}
          renderNode={this.renderNode}
          readOnly
        />
      </div>
    );
  }
}

export default ReviewTextEditor;
