import { Block } from 'slate';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5mb

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node }) => {
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

const onClickImage = (editor, event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.match(/^image\/(jpeg|png)/)) {
      throw new Error('Only JPG or PNG files can be added');
    }

    if (file.size > MAX_IMAGE_SIZE) {
      const actual = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`Image too large. Image files must be less than 5mb. This image: ${actual}mb`);
    }

    const body = new FormData();
    body.append('file', file);

    const image = Block.create({
      type: 'image',
      data: { loading: true }
    });
    const block = editor.value.blocks.get(0);

    // if in an empty paragrpah then replace the paragraph with the iamge
    if (block.text === '') {
      editor.replaceNodeByKey(block.key, image);
    } else {
      editor.insertBlock(image);
    }

    // if adding an image at the end of the document insert a new paragraph after
    const next = editor.value.document.getNextBlock(block.key);
    if (!next) {
      editor.moveToEndOfDocument();
      editor.insertBlock({ type: 'paragraph' });
    }

    const key = image.get('key');
    fetch('/attachment', { method: 'POST', body })
      .then(result => {
        if (result.status !== 200) {
          throw new Error('Failed to save image');
        }
        return result.json()
      })
      .then(({ token }) => {
        if (!token) {
          throw new Error('Failed to save image');
        }
        editor.setNodeByKey(key, { data: { loading: false, src: `/attachment/${token}` } });
      })
      .catch(e => {
        editor.removeNodeByKey(key);
        throw e;
      });

    event.target.value = '';
  }
};

function Image() {
  return {
    commands: {
      onClickImage
    },
    schema
  }
}

export default Image;
