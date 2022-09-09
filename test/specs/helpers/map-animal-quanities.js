import assert from 'assert';
import { mapAnimalQuantities } from '../../../client/helpers';

describe('mapAnimalQuantities', () => {

  it('returns a map of species to quantities', () => {
    const project = {
      species: ['mice', 'rats', 'guinea-pigs'],
      'reduction-mice': '100',
      'reduction-rats': '200',
      'reduction-guinea-pigs': '300'
    };
    const output = mapAnimalQuantities(project, 'reduction');

    assert.equal(output['reduction-mice'], '100');
    assert.equal(output['reduction-rats'], '200');
    assert.equal(output['reduction-guinea-pigs'], '300');
    assert.deepEqual(output.species, ['mice', 'rats', 'guinea-pigs']);
  });

  it('includes "other" species types in map', () => {
    const project = {
      species: ['mice', 'other-rodents', 'other-fish'],
      'species-other-rodents': ['capybara', 'chipmunk'],
      'species-other-fish': 'carp',
      'reduction-mice': '100',
      'reduction-capybara': '200',
      'reduction-chipmunk': '300',
      'reduction-carp': '400'
    };
    const output = mapAnimalQuantities(project, 'reduction');

    assert.equal(output['reduction-mice'], '100');
    assert.equal(output['reduction-capybara'], '200');
    assert.equal(output['reduction-chipmunk'], '300');
    assert.equal(output['reduction-carp'], '400');
    assert.deepEqual(output.species, ['mice', 'capybara', 'chipmunk', 'carp']);
  });

});
