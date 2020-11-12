import uniq from 'lodash/uniq';

export default function getLocations (project, establishment, establishments) {
  let est = establishment;
  if (project.transferToEstablishment) {
    est = establishments.find(e => e.id === project.transferToEstablishment);
  }
  const additionalEstablishments = (project.establishments || []).map(e => {
    const estFromSettings = establishments.find(est => est.id === e['establishment-id']);
    if (estFromSettings) {
      return estFromSettings.name;
    }
    return e.name || e['establishment-name']
  });
  const poles = (project.polesList || []).filter(p => p.title).map(p => p.title);
  return uniq([
    est.name,
    ...additionalEstablishments,
    ...poles
  ]);
}
