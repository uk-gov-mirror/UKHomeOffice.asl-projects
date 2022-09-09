import saveAs from 'file-saver';
import { Packer } from 'docx';
import renderer from './docx-renderer';

// 600px seems to be roughly 100% page width (inside the margins)
const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;

const pack = (doc, filename) => {
  const packer = new Packer(doc);

  packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};

const scaleAndPreserveAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
};

const updateImageDimensions = node => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = node.data.src;

    image.onload = () => {
      const dimensions = scaleAndPreserveAspectRatio(
        image.naturalWidth,
        image.naturalHeight,
        MAX_IMAGE_WIDTH,
        MAX_IMAGE_HEIGHT
      );
      node.data.width = dimensions.width;
      node.data.height = dimensions.height;
      resolve(node);
    };
  });
};

export default application => {
  return {
    render: ({ sections, values }) => {
      return Promise.resolve()
        .then(() => renderer(application, sections, values, updateImageDimensions))
        .then(doc => pack(doc, values.title));
    }
  };
};
