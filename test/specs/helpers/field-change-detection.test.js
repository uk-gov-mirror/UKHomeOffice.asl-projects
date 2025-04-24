// field-change-detection.test.js
import assert from 'assert';
import { hasDatabaseChange } from '../../../client/helpers/field-change-detection';

/**
 * Test coverage:
 * - Simple text fields
 * - Cleared fields
 * - Duration fields
 * - Arrays (select/multi-select)
 * - Nested objects
 * - Reverted changes
 * - Granted application scenarios
 */
describe('hasDatabaseChange', () => {

  it('returns false for unchanged simple text field', () => {
    const result = hasDatabaseChange('experience', 'test', 'test', 'test', 'test', 'test', false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('detects change in simple text field', () => {
    const result = hasDatabaseChange('experience', 'test', 'test 2', 'test', 'test', 'test', false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('detects cleared text field', () => {
    const result = hasDatabaseChange('experience', 'test', '', 'test', 'test', 'test', false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('returns false if reverted to base version', () => {
    const result = hasDatabaseChange('experience', 'test 2', 'test', 'test 2', 'test', 'test', false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('returns false if reverted to latest submitted version', () => {
    const result = hasDatabaseChange('experience', 'test 2', 'test 2', 'test 2', 'test', 'test', false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('detects change if radio button toggled Yes -> No -> No', () => {
    const result = hasDatabaseChange('radio-field', 'yes', 'no', 'yes', 'yes', 'yes', false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('detects change in duration field', () => {
    const result = hasDatabaseChange('duration', '5 years 0 months', '7 years 0 months', '5 years 0 months', '5 years 0 months', '5 years 0 months', false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('returns false for logically equivalent duration', () => {
    const result = hasDatabaseChange('duration', '5 years 0 months', '5 years 0 months', '5 years 0 months', '5 years 0 months', '5 years 0 months', false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('detects change in array (select) values', () => {
    const result = hasDatabaseChange('species', ['mice', 'rats'], ['mice', 'rats', 'dogs'], ['mice', 'rats'], ['mice', 'rats'], ['mice', 'rats'], false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('returns false for same arrays', () => {
    const result = hasDatabaseChange('species', ['mice', 'rats'], ['mice', 'rats'], ['mice', 'rats'], ['mice', 'rats'], ['mice', 'rats'], false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('detects change in nested object', () => {
    const initial = [{ id: 1, title: 'test' }];
    const modified = [{ id: 1, title: 'test updated' }];
    const result = hasDatabaseChange('protocols', initial, modified, initial, initial, initial, false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('handles granted application badge logic', () => {
    const result = hasDatabaseChange('experience', 'test 2', 'test 3', 'test 2', 'test', 'test 2', true, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('detects change in boolean field', () => {
    const result = hasDatabaseChange('isLegacyProject', true, false, true, true, true, false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('detects change in number field', () => {
    const result = hasDatabaseChange('licenceNumber', 123, 456, 123, 123, 123, false, {}, () => false);
    assert.strictEqual(result, true);
  });

  it('returns false for empty object comparison', () => {
    const result = hasDatabaseChange('fields', {}, {}, {}, {}, {}, false, {}, () => false);
    assert.strictEqual(result, false);
  });

  it('detects change in rich text field (Slate.js object)', () => {
    const initial = { document: { nodes: [{ object: 'block', nodes: [{ object: 'text', text: 'Hello' }] }] } };
    const modified = { document: { nodes: [{ object: 'block', nodes: [{ object: 'text', text: 'Hello World' }] }] } };
    const result = hasDatabaseChange('objectivesRichText', initial, modified, initial, initial, initial, false, {}, () => false);
    assert.strictEqual(result, true);
  });

});
