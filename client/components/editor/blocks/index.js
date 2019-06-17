import renderBlock from './render-block';

const DEFAULT_NODE = 'paragraph';

const hasBlock = (editor, event, type) => {
  const { value } = editor;
  return value.blocks.some(node => node.type == type);
};

const toggleBlock = (editor, type) => {
  const { value } = editor;
  const { document } = value;

  // Handle everything but list buttons.
  if (type != 'bulleted-list' && type != 'numbered-list') {
    const isActive = hasBlock(editor, type);
    const isList = hasBlock(editor, 'list-item');

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
    const isList = hasBlock(editor, 'list-item');
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

export default function Blocks() {
  return {
    renderBlock,
    commands: {
      toggleBlock
    },
    queries: {
      hasBlock
    }
  }
}
