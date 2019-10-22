import { Block } from 'slate';
import Jimp from 'jimp';

const MAX_IMAGE_SIZE = 1024 * 1024; // 1mb
const MAX_IMAGE_WIDTH = 1200;
const IMAGE_QUALITY = 50;

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

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: 'image',
    data: { src }
  });
}

const onClickImage = (editor, event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.match(/^image\/*/)) {
      throw new Error('Only images can be added');
    }

    if (file.size > MAX_IMAGE_SIZE) {
      const actual = Math.round(file.size / 1024);
      throw new Error(`Image too large. Image files must be less than 1024kb. This image: ${actual}kb`);
    }

    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        Jimp.read(reader.result)
          .then(image => {
            return image.bitmap.width > MAX_IMAGE_WIDTH
              ? image.resize(MAX_IMAGE_WIDTH, Jimp.AUTO)
              : image;
          })
          .then(image => image.quality(IMAGE_QUALITY))
          .then(image => image.getBase64Async(Jimp.AUTO))
          .then(base64Image => {
            editor.command(insertImage, base64Image);
          })
          .catch(err => {
            console.log(err);
            throw new Error('There was an issue saving your image, please try again');
          });
      },
      false
    );
    reader.readAsArrayBuffer(file);
  }
  event.target.value = '';
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
