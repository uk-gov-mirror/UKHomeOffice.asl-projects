module.exports = () => {

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('asl');
    request.onerror = reject;
    request.onupgradeneeded = event => {
      const db = event.target.result;
      const objStore = db.createObjectStore('projects', { autoIncrement : true });
    };
    request.onsuccess = event => {
      const db = event.target.result;
      resolve({
        list: () => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(['projects']);
            const objectStore = transaction.objectStore('projects');

            const request = objectStore.openCursor();
            const result = [];

            request.onsuccess = event => {
              const cursor = event.target.result;
              if (cursor) {
                result.push({
                  id: cursor.key,
                  ...cursor.value
                });
                cursor.continue();
              } else {
                resolve(result);
              }
            };
            transaction.onerror = e => reject(e);
          });
        },
        update: (id, data) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(['projects'], 'readwrite');
            const objectStore = transaction.objectStore('projects');
            const request = objectStore.put(data, id);
            request.onsuccess = e => resolve({
              id,
              ...data
            });
            transaction.onerror = e => reject(e);
          });
        },
        create: project => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(['projects'], 'readwrite');
            const objectStore = transaction.objectStore('projects');
            const request = objectStore.add({ ...project, updated: Date.now() });
            request.onsuccess = e => {
              return resolve({
                id: e.target.result,
                ...project
              });
            };
            transaction.onerror = e => reject(e);
          });
        },
        delete: id => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(['projects'], 'readwrite');
            const objectStore = transaction.objectStore('projects');
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve();
            transaction.onerror = e => reject(e);
          });
        }
      });
    };
  });

};
