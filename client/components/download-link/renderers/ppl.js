import { saveAs } from 'file-saver';

export default () => ({
  render: ({ values }) => {
    const blob = new Blob([JSON.stringify(values)], { type: 'data:application/json' });
    saveAs(blob, `${values.title}.ppl`);
  }
});
