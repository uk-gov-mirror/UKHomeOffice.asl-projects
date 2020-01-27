import assert from 'assert';
import helper from '../../../client/helpers/retrospective-assessment';

describe('retrospective-assessment', () => {

  it('returns false if not passed a project', () => {
    assert.equal(helper(), false);
  });

  it('returns false if project does not match any criteria', () => {
    const project = {
      species: ['mice', 'rats'],
      'species-other': ['Cows'],
      'endangered-animals': false,
      protocols: [
        { severity: 'moderate' },
        { severity: 'mild' }
      ]
    };
    assert.equal(helper(project), false);
  });

  it('returns true if project uses horses', () => {
    const project = {
      species: ['mice', 'rats', 'horses'],
      'endangered-animals': false,
      protocols: [
        { severity: 'moderate' },
        { severity: 'mild' }
      ]
    };
    assert.equal(helper(project), true);
  });

  it('returns true if project uses an "other" species which matches a restricted species', () => {
    const project = {
      species: ['mice', 'rats'],
      'species-other': ['Rhesus macaques'],
      'endangered-animals': false,
      protocols: [
        { severity: 'moderate' },
        { severity: 'mild' }
      ]
    };
    assert.equal(helper(project), true);
  });

  it('returns true if project uses endangered species', () => {
    const project = {
      species: ['mice', 'rats'],
      'endangered-animals': true,
      protocols: [
        { severity: 'moderate' },
        { severity: 'mild' }
      ]
    };
    assert.equal(helper(project), true);
  });

  it('returns true if project has a severe protocol', () => {
    const project = {
      species: ['mice', 'rats'],
      'endangered-animals': false,
      protocols: [
        { severity: 'moderate' },
        { severity: 'mild' },
        { severity: 'severe' }
      ]
    };
    assert.equal(helper(project), true);
  });

});
