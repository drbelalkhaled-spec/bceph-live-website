/* ── QR FEATURE ── */
const BCeph = window.BCeph || {};
BCeph.qrScannerStream = null;
BCeph._qrScanActive = false;

function generateQRDataUrl(text) {
  if (!text || typeof qrcode === 'undefined') return null;
  var types = [3, 5, 8, 12, 20];
  for (var i = 0; i < types.length; i++) {
    try {
      var qr = qrcode(types[i], 'M');
      qr.addData(text, 'Byte');
      qr.make();
      var size = qr.getModuleCount(), scale = 8;
      var c = document.createElement('canvas');
      c.width = size * scale; c.height = size * scale;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#000';
      for (var r = 0; r < size; r++) {
        for (var col = 0; col < size; col++) {
          if (qr.isDark(r, col)) ctx.fillRect(col * scale, r * scale, scale, scale);
        }
      }
      return c.toDataURL('image/png');
    } catch(e) { continue; }
  }
  return null;
}

function openQRScanner() {
  var video = document.getElementById('qrs-video');
  var errorEl = document.getElementById('qrs-error');
  var manualWrap = document.getElementById('qrs-manual-wrap');
  errorEl.textContent = '';
  manualWrap.style.display = 'none';
  document.getElementById('qrs-manual-input').value = '';
  video.style.display = 'none';
  openModal('qr-scanner-modal');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    manualWrap.style.display = 'block';
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
      BCeph.qrScannerStream = stream;
      video.srcObject = stream;
      video.play();
      video.style.display = 'block';
      startQRScanLoop(video, errorEl);
    })
    .catch(function() {
      manualWrap.style.display = 'block';
    });
}

function closeQRScanner() {
  if (BCeph.qrScannerStream) {
    BCeph.qrScannerStream.getTracks().forEach(function(t) { t.stop(); });
    BCeph.qrScannerStream = null;
  }
  BCeph._qrScanActive = false;
  var el = document.getElementById('qr-scanner-modal');
  if (el) el.classList.remove('open');
}

function startQRScanLoop(video, errorEl) {
  BCeph._qrScanActive = true;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  function tick() {
    if (!BCeph._qrScanActive) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      if (window.BarcodeDetector) {
        new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas)
          .then(function(codes) {
            if (codes.length && BCeph._qrScanActive) handleQRResult(codes[0].rawValue, errorEl);
          }).catch(function(){});
      } else if (typeof jsQR !== 'undefined') {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && BCeph._qrScanActive) { handleQRResult(code.data, errorEl); return; }
      }
    }
    if (BCeph._qrScanActive) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function handleQRResult(rawValue, errorEl) {
  if (!rawValue) return;
  BCeph._qrScanActive = false;
  var fileNo = rawValue.trim();
  var db = getPatientDB();
  var match = db.find(function(p) { return (p.fileno || '').trim() === fileNo; });
  if (match) {
    closeQRScanner();
    loadPatientFromList(match.id).then(function() {
      openPatientModal();
    });
  } else {
    if (errorEl) errorEl.textContent = 'No patient found for this QR (' + fileNo + ')';
    BCeph._qrScanActive = true;
    startQRScanLoop(document.getElementById('qrs-video'), errorEl);
  }
}

function submitQRManual() {
  var val = document.getElementById('qrs-manual-input').value.trim();
  if (!val) return;
  handleQRResult(val, document.getElementById('qrs-error'));
}
