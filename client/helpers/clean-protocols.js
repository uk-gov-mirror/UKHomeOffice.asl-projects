import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import getLocations from './get-locations';

export default function cleanProtocols({ state, savedState, changed = {}, establishment, schemaVersion }) {
  const project = { ...state, ...changed };

  if (schemaVersion === 0) {
    return project;
  }

  if (!changed.objectives && !changed.establishments && !changed.polesList && !changed.transferToEstablishmentName && !changed.species) {
    return project;
  }

  project.protocols = project.protocols || [];

  if (changed.species) {
    const removedProjectSpecies = difference(savedState.species, changed.species);

    project.protocols.forEach(protocol => {
      if (!Array.isArray(protocol.species)) {
        return;
      }
      protocol.species = protocol.species.filter(species => !removedProjectSpecies.includes(species));
    });
  }

  const locations = getLocations(project, establishment);
  const objectives = (project.objectives || []).map(o => o.title);

  project.protocols.forEach(protocol => {
    if (changed.objectives) {
      protocol.objectives = intersection(protocol.objectives, objectives);
    }
    if (changed.establishments || changed.polesList || changed.transferToEstablishmentName) {
      protocol.locations = intersection(protocol.locations, locations);
    }
  });
  return project;
}
