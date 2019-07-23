import renderBlock from './render-block';

const DEFAULT_NODE = 'paragraph';

const hasBlock = (editor, event, type) => {
  const { value } = editor;
  return value.blocks.some(node => node.type == type);
};

const toggleBlock = (editor, type) => {
  const isActive = hasBlock(editor, type);
  editor.setBlocks(isActive ? DEFAULT_NODE : type);
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
