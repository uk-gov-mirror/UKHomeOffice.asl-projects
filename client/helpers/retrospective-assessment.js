import some from 'lodash/some';
import intersection from 'lodash/intersection';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import SPECIES from '../constants/species';

const species = flatten(values(SPECIES));

const nopes = [
  // legacy
  'prosimians',
  'marmosets',
  'cynomolgus',
  'rhesus',
  // legacy
  'vervets',
  // legacy
  'baboons',
  // legacy
  'squirrel-monkeys',
  // legacy
  'other-old-world',
  // legacy
  'other-new-world',
  'other-nhps',
  // legacy
  'apes',
  'beagles',
  'other-dogs',
  'cats',
  'horses'
];

export default function raApplies(project) {
  if (!project) {
    return false;
  }
  const hasRASpecies = !!intersection(project.species, nopes).length;
  const hasRASpeciesOther = !!intersection(project['species-other'], nopes.map(n => (species.find(s => s.value === n) || {}).label)).length;
  const hasEndangeredAnimals = project['endangered-animals'];
  const hasSevereProtocols = some(project.protocols, p => (p.severity || '').match(/severe/ig));
  return hasRASpecies || hasRASpeciesOther || hasEndangeredAnimals || hasSevereProtocols;
}
