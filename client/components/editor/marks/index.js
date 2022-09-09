import renderMark from './render-mark';
import { onKeyDown } from './handlers';

// TODO: make this not suck
const clearMarks = editor => {
  editor
    .removeMark('underlined')
    .removeMark('italic')
    .removeMark('bold')
    .removeMark('code')
    .removeMark('superscript')
    .removeMark('subscript');
};

export default function Marks() {
  return {
    renderMark,
    onKeyDown,
    commands: {
      clearMarks
    }
  };
}
