export default (text = '') => ({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text,
          }
        ]
      }
    ]
  }
});
