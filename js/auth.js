/* ── FIREBASE CONFIG ── */
const firebaseConfig = {
  apiKey: "AIzaSyDVaskE99JZgKQktUIDzwN6hr1foZQHCuo",
  authDomain: "auth.bceph.com",
  projectId: "bceph-f5a57",
  storageBucket: "bceph-f5a57.firebasestorage.app",
  messagingSenderId: "719340404508",
  appId: "1:719340404508:web:ebdf140e98dd8df96904d9",
  measurementId: "G-7S73KJYE43"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = firebase.analytics();
const db = firebase.firestore();

/* ── AUTH STATE ── */
let currentUser = null;
const FREE_USES = 5;

function getUseCount() { return parseInt(localStorage.getItem('bceph_use_count') || '0'); }
function incrementUseCount() { const c = getUseCount() + 1; localStorage.setItem('bceph_use_count', String(c)); return c; }
function showLoginModal() { document.getElementById('login-modal').style.display = 'flex'; }
function hideLoginModal() { document.getElementById('login-modal').style.display = 'none'; }

function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => {
    console.error('Auth error:', err);
  });
}

auth.onAuthStateChanged(async user => {
  currentUser = user;
  if (user) {
    hideLoginModal();
    analytics.logEvent('session_start', { method: 'google' });
    checkSubscription();
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      displayName: user.displayName || ''
    }, { merge: true });
    document.getElementById('logout-btn').style.display = '';
    document.getElementById('sync-btn').style.display = '';

    cloudSync = new CloudSync(user);
    updateSyncStatus('syncing');
    try {
      const lastSyncTs = cloudSync.getLastSyncTs();
      if (lastSyncTs === 0) {
        await cloudSync.pushAll();
      } else {
        await cloudSync.pushChangedSince(lastSyncTs);
      }
      const cloudPatients = lastSyncTs === 0
        ? await cloudSync.restoreAll()
        : await cloudSync.fetchChangedSince(lastSyncTs);
      if (cloudPatients.length > 0) {
        const localDb = getPatientDB();
        const { merged, added, updated } = smartMergePatients(localDb, cloudPatients);
        if (added > 0 || updated > 0) {
          setPatientDB(merged);
          const parts = [];
          if (added > 0) parts.push(added + ' new');
          if (updated > 0) parts.push(updated + ' updated');
          toast('Cloud sync: ' + parts.join(', ') + ' patient(s)', '☁️');
        }
      }
      cloudSync.setLastSyncTs(Date.now());
      updateSyncStatus('synced');
    } catch(e) {
      console.warn('Login sync error:', e);
      updateSyncStatus('error');
    }
  } else {
    cloudSync = null;
    updateSyncStatus('');
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('sync-btn').style.display = 'none';
  }
});

/* ── SUBSCRIPTION SKELETON ── */
let isPro = false;
let subscriptionStatus = 'free'; // 'free' | 'pro' | 'expired'

async function checkSubscription() {
  // TODO: When Stripe is ready, replace this with an actual check:
  // 1. Call Stripe API or Firestore to verify subscription status for currentUser.uid
  // 2. Set isPro = true/false based on response
  // 3. Cache result in localStorage with timestamp
  //
  // For now, everyone is free tier:
  isPro = false;
  subscriptionStatus = 'free';
  return subscriptionStatus;
}

function requirePro(featureName) {
  // Gate a feature behind Pro subscription.
  // Usage: if (!requirePro('advanced_export')) return;
  if (isPro) return true;
  // TODO: Show upgrade modal when Stripe is ready
  console.log('[BCeph] Pro feature "' + featureName + '" — upgrade required.');
  return false;
}

/* ── AUTH GATE HELPER ── */
function checkAuthGate() {
  if (currentUser) return; // logged in, do nothing
  const count = incrementUseCount();
  if (count >= FREE_USES) { showLoginModal(); }
}
