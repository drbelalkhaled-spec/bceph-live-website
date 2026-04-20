/* ── CLOUD SYNC ── */
let cloudSync = null;

class CloudSync {
  constructor(user) { this.user = user; }
  get uid() { return this.user?.uid || currentUser?.uid; }
  _doc(id) { return db.collection('users').doc(this.uid).collection('bceph_patients').doc(id); }
  _coll() { return db.collection('users').doc(this.uid).collection('bceph_patients'); }
  getLastSyncTs() { return parseInt(localStorage.getItem('bceph_sync_ts_' + this.uid) || '0', 10); }
  setLastSyncTs(ts) { localStorage.setItem('bceph_sync_ts_' + this.uid, String(ts)); }

  async compressImageForCloud(patientId) {
    const imgData = await idbGetImage(patientId);
    if (!imgData) return null;
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const maxDim = 1200;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let w = image.naturalWidth, h = image.naturalHeight;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * r); h = Math.round(h * r);
        }
        canvas.width = w; canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h);
        let quality = 0.75;
        let result = canvas.toDataURL('image/jpeg', quality);
        while (result.length > 700000 && quality > 0.3) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(result.length < 900000 ? result : null);
      };
      image.onerror = () => resolve(null);
      image.src = imgData;
    });
  }

  async saveRecord(record) {
    const payload = {
      name: record.name || '',
      fileno: record.fileno || '',
      gender: record.gender || '',
      dob: record.dob || '',
      age: record.age || '',
      xraydate: record.xraydate || '',
      doctor: record.doctor || '',
      complaint: record.complaint || '',
      updatedAt: record.updatedAt || Date.now(),
      _tracing: record._tracing ? {
        landmarks: record._tracing.landmarks || {},
        pixelsPerMm: record._tracing.pixelsPerMm || 0,
        notes: record._tracing.notes || '',
        skipped: record._tracing.skipped || [],
        origImgW: record._tracing.origImgW || 0,
        origImgH: record._tracing.origImgH || 0
      } : null
    };
    const cloudImage = await this.compressImageForCloud(record.id);
    if (cloudImage) payload.cloudImage = cloudImage;
    await this._doc(record.id).set(payload, { merge: true });
    this.setLastSyncTs(Date.now());
  }

  async deleteRecord(id) { await this._doc(id).delete(); }

  async restoreAll() {
    const snap = await this._coll().get();
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  }

  async fetchChangedSince(sinceTs) {
    const snap = await this._coll().where('updatedAt', '>', sinceTs).get();
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  }

  async pushChangedSince(sinceTs) {
    const localDb = getPatientDB();
    let pushed = 0;
    for (const entry of localDb) {
      if ((entry.updatedAt || 0) > sinceTs) {
        try { await this.saveRecord(entry); pushed++; }
        catch(e) { console.warn('Push failed for', entry.id, e); }
      }
    }
    return pushed;
  }

  async pushAll() {
    const localDb = getPatientDB();
    for (const entry of localDb) {
      try { await this.saveRecord(entry); }
      catch(e) { console.warn('Push failed for', entry.id, e); }
    }
  }
}

function smartMergePatients(localDb, cloudPatients) {
  const localMap = {};
  localDb.forEach((r, i) => { localMap[r.id] = i; });
  let added = 0, updated = 0;
  for (const p of cloudPatients) {
    const cloudEntry = {
      id: p.id, name: p.name || '', fileno: p.fileno || '',
      gender: p.gender || '', dob: p.dob || '', age: p.age || '',
      xraydate: p.xraydate || '', doctor: p.doctor || '',
      complaint: p.complaint || '', _tracing: p._tracing || null,
      updatedAt: p.updatedAt || 0
    };
    if (localMap[p.id] === undefined) {
      localDb.push(cloudEntry);
      if (p.cloudImage) idbSaveImage(p.id, p.cloudImage).catch(() => {});
      added++;
    } else {
      const idx = localMap[p.id];
      if ((p.updatedAt || 0) > (localDb[idx].updatedAt || 0)) {
        localDb[idx] = cloudEntry;
        if (p.cloudImage) idbSaveImage(p.id, p.cloudImage).catch(() => {});
        updated++;
      }
    }
  }
  return { merged: localDb, added, updated };
}

function updateSyncStatus(status) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  if (!status) { el.style.display = 'none'; return; }
  el.style.display = '';
  if (status === 'syncing') { el.textContent = '☁️ Syncing…'; el.style.color = '#fbbf24'; }
  else if (status === 'synced') { el.textContent = '☁️ Synced'; el.style.color = '#34d399'; }
  else if (status === 'error') { el.textContent = '☁️ Error'; el.style.color = '#f87171'; }
}

async function logout() {
  if (!confirm('Sign out? Your data is safely backed up in the cloud.')) return;
  localStorage.removeItem('bceph_patients');
  localStorage.removeItem('bceph_data');
  try { indexedDB.deleteDatabase('bceph_images'); } catch(e) {}
  cloudSync = null;
  await auth.signOut();
  toast('Signed out', '👋');
  showLoginModal();
  clearWorkspace();
}

async function manualSync() {
  if (!cloudSync) { toast('Sign in first', '⚠️'); return; }
  updateSyncStatus('syncing');
  try {
    await cloudSync.pushAll();
    const patients = await cloudSync.restoreAll();
    if (patients.length > 0) {
      const localDb = getPatientDB();
      const { merged, added, updated } = smartMergePatients(localDb, patients);
      if (added > 0 || updated > 0) setPatientDB(merged);
      const parts = [];
      if (added > 0) parts.push(added + ' new');
      if (updated > 0) parts.push(updated + ' updated');
      toast(parts.length > 0 ? 'Synced: ' + parts.join(', ') : 'Up to date', '☁️');
    } else {
      toast('Up to date', '☁️');
    }
    cloudSync.setLastSyncTs(Date.now());
    updateSyncStatus('synced');
  } catch(e) {
    updateSyncStatus('error');
    toast('Sync failed: ' + e.message, '❌');
  }
}

window.addEventListener('online', () => {
  if (cloudSync) {
    updateSyncStatus('syncing');
    const lastTs = cloudSync.getLastSyncTs();
    cloudSync.pushChangedSince(lastTs)
      .then(() => { cloudSync.setLastSyncTs(Date.now()); updateSyncStatus('synced'); })
      .catch(() => updateSyncStatus('error'));
  }
});
