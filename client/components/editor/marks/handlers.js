import { isKeyHotkey } from 'is-hotkey';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');
const isSuperscriptHotkey = isKeyHotkey('mod+=');
const isSubscriptHotkey = isKeyHotkey('mod+shift++');

export const onKeyDown = (event, editor, next) => {
  let mark;

  if (isBoldHotkey(event)) {
    mark = 'bold';
  } else if (isItalicHotkey(event)) {
    mark = 'italic';
  } else if (isUnderlinedHotkey(event)) {
    mark = 'underlined';
  } else if (isCodeHotkey(event)) {
    mark = 'code';
  } else if (isSuperscriptHotkey(event)) {
    mark = 'superscript';
  } else if (isSubscriptHotkey(event)) {
    mark = 'subscript';
  } else {
    return next();
  }

  event.preventDefault();
  editor.toggleMark(mark);
};
