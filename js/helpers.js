function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ if(id==='qr-scanner-modal'){closeQRScanner();return;} document.getElementById(id).classList.remove('open'); }
function toast(msg,icon){ const t=document.getElementById('toast');document.getElementById('toast-icon').textContent=icon||'✅';document.getElementById('toast-msg').textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2800); }
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
