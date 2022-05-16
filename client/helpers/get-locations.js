export default function getLocations (project, establishment) {
  const establishments = (project.establishments || [])
    .filter(e => e.name || e['establishment-name'])
    .filter(e => !e.deleted) // AA which is being removed during amendment
    .map(e => e.name || e['establishment-name']);

  const poles = (project.polesList || []).filter(p => p.title).map(p => p.title);

  return [
    project.transferToEstablishmentName || establishment.name,
    ...establishments,
    ...poles
  ];
}
