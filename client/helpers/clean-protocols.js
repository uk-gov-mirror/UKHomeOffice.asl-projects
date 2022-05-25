import intersection from 'lodash/intersection';
import getLocations from './get-locations';

export default function cleanProtocols (state, props = {}, establishment, schemaVersion) {
  const project = { ...state, ...props };

  if (schemaVersion === 0) {
    return project;
  }

  if (!props.objectives && !props.establishments && !props.polesList && !props.transferToEstablishmentName) {
    return project;
  }

  project.protocols = project.protocols || [];

  const locations = getLocations(project, establishment);
  const objectives = (project.objectives || []).map(o => o.title);

  project.protocols.forEach(protocol => {
    protocol.objectives = intersection(protocol.objectives, objectives);
    protocol.locations = intersection(protocol.locations, locations);
  });
  return project;
}
