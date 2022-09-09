import normaliseWhitespace from '../../../helpers/normalise-whitespace';
import renderBlock from './render-block';
import { Text } from 'slate';

const DEFAULT_BLOCK = 'paragraph';

const hasBlock = (editor, event, type) => {
  const { value } = editor;
  return value.blocks.some(node => node.type === type);
};

const findRootElem = (document, block) => {
  const parent = document.getParent(block.key);
  if (parent.object === 'document' || parent.type === 'table-cell') {
    return block;
  }
  return findRootElem(document, parent);
};

const unwrapBlock = (editor, block) => {
  const { value } = editor;
  const { document } = value;
  block = block || value.startBlock;

  const parent = document.getParent(block.key);

  if (parent.object === 'document' || parent.type === 'table-cell') {
    return null;
  }

  editor.withoutNormalizing(() => {
    editor.unwrapBlockByKey(parent.key);
    unwrapBlock(editor, block);
  });

};

const unwrapBlocks = editor => {
  const { value } = editor;
  const { document } = value;

  if (!value.selection.start.key) {
    return null;
  }

  const root = findRootElem(document, value.startBlock);
  const childBlocks = root.getBlocks();

  childBlocks.forEach(block => unwrapBlock(editor, block));
  editor.setBlocks(DEFAULT_BLOCK);
};

const toggleBlock = (editor, type) => {
  const isActive = hasBlock(editor, type);
  editor.setBlocks(isActive ? DEFAULT_BLOCK : type);
};

export default function Blocks() {
  return {
    // this needs to be american spelling and I don't like it either
    normalizeNode: (node, editor, next) => {
      if (node.object === 'text') {
        const text = normaliseWhitespace(node.text);
        if (node.text !== text) {
          return () => editor.replaceNodeByKey(node.key, Text.create({ text }));
        }
      }
      next();
    },
    renderBlock,
    commands: {
      toggleBlock,
      unwrapBlocks
    },
    queries: {
      hasBlock
    }
  };
}
