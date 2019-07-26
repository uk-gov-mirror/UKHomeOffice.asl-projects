import saveAs from 'file-saver';
import { Packer } from '@joefitter/docx';
import renderer from './docx-renderer';

const pack = (doc, filename) => {
  const packer = new Packer(doc);

  packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};

export default application => {
  return {
    render: ({ sections, values }) => {
      return Promise.resolve()
        .then(() => renderer(application, sections, values))
        .then(doc => pack(doc, values.title))
    }
  }
};
