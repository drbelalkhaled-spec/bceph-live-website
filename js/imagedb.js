/* ── IndexedDB Image Store ── */
function openImageDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('bceph_images', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function idbSaveImage(patientId, imgData) {
  try {
    const db = await openImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put({ id: patientId, imgData: imgData });
      tx.oncomplete = () => resolve(true);
      tx.onerror = e => reject(e.target.error);
    });
  } catch (e) {
    console.warn('[BCeph] IDB save failed:', e);
    return false;
  }
}

async function idbGetImage(patientId) {
  try {
    const db = await openImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const req = tx.objectStore('images').get(patientId);
      req.onsuccess = () => resolve(req.result?.imgData || null);
      req.onerror = e => reject(e.target.error);
    });
  } catch (e) {
    console.warn('[BCeph] IDB get failed:', e);
    return null;
  }
}

async function idbDeleteImage(patientId) {
  try {
    const db = await openImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').delete(patientId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = e => reject(e.target.error);
    });
  } catch (e) {
    console.warn('[BCeph] IDB delete failed:', e);
    return false;
  }
}

async function idbGetAllImages() {
  try {
    const db = await openImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const req = tx.objectStore('images').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = e => reject(e.target.error);
    });
  } catch (e) {
    console.warn('[BCeph] IDB getAll failed:', e);
    return [];
  }
}
