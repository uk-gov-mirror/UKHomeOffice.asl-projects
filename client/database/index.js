export default () => {

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('asl');
    request.onerror = reject;
    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore('projects', { autoIncrement: true });
      db.createObjectStore('settings', { autoIncrement: true });
    };
    request.onsuccess = event => {
      const db = event.target.result;
      resolve({
        list: (table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table]);
            const objectStore = transaction.objectStore(table);

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
        read: (id, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table]);
            const objectStore = transaction.objectStore(table);
            const request = objectStore.get(id);
            request.onsuccess = e => resolve({
              id,
              ...e.target.result
            });
            transaction.onerror = e => reject(e);
          });
        },
        update: (id, data, table = 'projects') => {
          data.updated = Date.now();
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.put(data, id);
            request.onsuccess = () => resolve({
              id,
              ...data
            });
            transaction.onerror = e => reject(e);
          });
        },
        create: (item, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            item.updated = item.updated || Date.now();
            const request = objectStore.add(item);
            request.onsuccess = e => {
              return resolve({
                id: e.target.result,
                ...item
              });
            };
            transaction.onerror = e => reject(e);
          });
        },
        delete: (id, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve();
            transaction.onerror = e => reject(e);
          });
        }
      });
    };
  });

};
