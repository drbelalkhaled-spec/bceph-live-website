/* ── CALIBRATION ── */
function updateCalibHUD(){
  const hud=document.getElementById('calib-hud');
  if(calibMode===1){ hud.classList.add('visible'); document.getElementById('calib-hud-label').textContent='📏 Click FIRST point on ruler'; document.getElementById('calib-hud-dist').textContent=''; }
  else if(calibMode===2){ hud.classList.add('visible'); document.getElementById('calib-hud-label').textContent='📏 Click SECOND point'; document.getElementById('calib-hud-dist').textContent='— px'; }
  else hud.classList.remove('visible');
}
function startCalibration(){ if(!img){toast('Load an image first','⚠️');return;} calibPts=[null,null]; calibMouseImg=null; calibMode=1; document.getElementById('calib-btn').classList.add('active'); updateCalibHUD(); toast('Click the FIRST point on the ruler','📏'); render(); }
function finishCalibClicks(){
  const pxDist=dist(calibPts[0],calibPts[1]);
  document.getElementById('calib-px-display').value=pxDist.toFixed(1)+' px';
  document.getElementById('calib-real-mm').value='';
  document.getElementById('calib-btn').classList.remove('active'); updateCalibHUD();
  openModal('calib-modal');
  setTimeout(()=>{ const el=document.getElementById('calib-real-mm'); if(el)el.focus(); },100);
}
function cancelCalibration(){ calibMode=0; calibPts=[null,null]; calibMouseImg=null; document.getElementById('calib-btn').classList.remove('active'); updateCalibHUD(); closeModal('calib-modal'); render(); }
function applyCalibration(){
  const mm=parseFloat(document.getElementById('calib-real-mm').value);
  if(isNaN(mm)||mm<=0){toast('Enter a valid distance in mm','⚠️');return;}
  const pxDist=dist(calibPts[0],calibPts[1]);
  if(pxDist<2){toast('Points are too close together','⚠️');return;}
  pixelsPerMm=pxDist/mm;
  document.getElementById('calib-status').textContent=pixelsPerMm.toFixed(2)+' px/mm';
  document.getElementById('calib-status').className='set';
  closeModal('calib-modal'); calibPts=[null,null]; calibMouseImg=null; updateCalibHUD(); render();
  updateMeasurements(); toast('Calibrated: '+pixelsPerMm.toFixed(2)+' px/mm ('+mm+' mm ref)','📏');
  if(currentUser && typeof analytics!=='undefined') analytics.logEvent('calibration_set');
}
