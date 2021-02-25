// eslint-disable-next-line no-control-regex
const invisibleWhitespace = /[\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]/g;

const normalise = str => str.replace(invisibleWhitespace, '');

export default normalise;
