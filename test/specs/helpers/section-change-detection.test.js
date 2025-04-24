import assert from 'assert';
import { hasSectionChanged } from '../../../client/helpers/section-change-detection';

describe('hasSectionChanged (ASPeL)', () => {
  // Mock versions of application states for testing
  const latestSubmittedVersion = {};
  const firstSubmittedVersion = {};
  const grantedVersion = {};

  it('returns false when no fields changed (baseline)', () => {
    const fieldPaths = ['title', 'species'];
    const currentDraft = { title: 'abc', species: ['mice'] };
    const previousDraft = { title: 'abc', species: ['mice'] };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, false);
  });

  it('detects simple field change (flat key)', () => {
    const fieldPaths = ['title'];
    const currentDraft = { title: 'updated title' };
    const previousDraft = { title: 'original title' };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('ignores whitespace-only changes (text area trim)', () => {
    const fieldPaths = ['title'];
    const currentDraft = { title: 'abc ' };
    const previousDraft = { title: 'abc' };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, false);
  });

  it('detects array field change (e.g. species selection)', () => {
    const fieldPaths = ['species'];
    const currentDraft = { species: ['mice', 'dogs'] };
    const previousDraft = { species: ['mice'] };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('detects change in nested protocol field (e.g. protocols[*].title)', () => {
    const fieldPaths = ['protocols.*.title'];
    const currentDraft = { protocols: [{ id: 1, title: 'new title' }] };
    const previousDraft = { protocols: [{ id: 1, title: 'old title' }] };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('detects change in deeply nested subfield (sub-sub section > field > subfield)', () => {
    const fieldPaths = ['section.subsection.subsubsection.field.subfield'];
    const currentDraft = { section: { subsection: { subsubsection: { field: { subfield: 'new' } } } } };
    const previousDraft = { section: { subsection: { subsubsection: { field: { subfield: 'old' } } } } };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('flags parent section as changed when sub-sub field changes', () => {
    const fieldPaths = ['section.subsection.subsubsection.field.subfield'];
    const currentDraft = { section: { subsection: { subsubsection: { field: { subfield: 'new value' } } } } };
    const previousDraft = { section: { subsection: { subsubsection: { field: { subfield: 'old value' } } } } };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('detects change in repeated protocol step field (protocols[*].steps[*].title)', () => {
    const fieldPaths = ['protocols.*.steps.*.title'];
    const currentDraft = { protocols: [{ steps: [{ title: 'New Step' }] }] };
    const previousDraft = { protocols: [{ steps: [{ title: 'Old Step' }] }] };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, true);
  });

  it('does not flag change when step is added and removed (net zero)', () => {
    const fieldPaths = ['protocols'];
    const currentDraft = { protocols: [] };
    const previousDraft = { protocols: [] };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedVersion, false);
    assert.strictEqual(result, false);
  });

  it('detects change compared to granted values (pink badge logic)', () => {
    const fieldPaths = ['title'];
    const currentDraft = { title: 'changed' };
    const previousDraft = { title: 'changed' };
    const grantedSnapshot = { title: 'original' };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedSnapshot, true);
    assert.strictEqual(result, true);
  });

  it('detects nested subsection field change with base vs granted (grey badge logic)', () => {
    const fieldPaths = ['section.subsection.field'];
    const currentDraft = { section: { subsection: { field: 'X' } } };
    const previousDraft = { section: { subsection: { field: 'X' } } };
    const grantedSnapshot = { section: { subsection: { field: 'Y' } } };

    const result = hasSectionChanged(fieldPaths, currentDraft, previousDraft, latestSubmittedVersion, firstSubmittedVersion, grantedSnapshot, true);
    assert.strictEqual(result, true);
  });
});
