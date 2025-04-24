// ✅ Add this line
import { normaliseValue } from '../../../client/helpers/normalisation';
// eslint-disable-next-line
const { expect } = require('chai');

describe('normaliseValue', () => {
  it('returns empty string for null or undefined', () => {
    expect(normaliseValue(null)).to.equal('');
    expect(normaliseValue(undefined)).to.equal('');
  });

  it('normalises a simple string', () => {
    expect(normaliseValue('  Hello world  ')).to.equal('Hello world');
  });

  it('collapses multiple spaces inside a string', () => {
    expect(normaliseValue('  Hello     world   from   ASPeL  ')).to.equal('Hello world from ASPeL');
  });

  it('normalises an object using json-stable-stringify', () => {
    const obj = { b: 2, a: 1 };
    expect(normaliseValue(obj)).to.equal('{"a":1,"b":2}');
  });

  it('normalises a Slate.js rich text object', () => {
    const richText = {
      document: {
        nodes: [
          { object: 'block', nodes: [{ object: 'text', text: 'Hello' }] },
          { object: 'block', nodes: [{ object: 'text', text: 'World' }] }
        ]
      }
    };
    expect(normaliseValue(richText)).to.equal('Hello\nWorld');
  });

  it('converts numbers and booleans to string', () => {
    expect(normaliseValue(123)).to.equal('123');
    expect(normaliseValue(true)).to.equal('true');
  });
});
