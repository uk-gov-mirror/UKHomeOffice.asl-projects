export const nuke = () => {
  indexedDB.deleteDatabase('asl');
  window.location.reload();
};
