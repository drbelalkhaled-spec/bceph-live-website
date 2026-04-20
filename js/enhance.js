/* ── IMAGE ENHANCEMENT ── */
let enhBrightness=100, enhContrast=100, enhSharpen=0, enhInvert=false;
function updateEnhancement(){
  enhBrightness=parseInt(document.getElementById('enh-brightness').value);
  enhContrast=parseInt(document.getElementById('enh-contrast').value);
  enhSharpen=parseInt(document.getElementById('enh-sharpen').value);
  document.getElementById('enh-brightness-val').textContent=enhBrightness+'%';
  document.getElementById('enh-contrast-val').textContent=enhContrast+'%';
  document.getElementById('enh-sharpen-val').textContent=enhSharpen+'%';
  render();
  if(currentUser && typeof analytics!=='undefined') analytics.logEvent('image_enhanced');
}
function toggleInvert(){ enhInvert=!enhInvert; document.getElementById('enh-invert-btn').classList.toggle('active',enhInvert); render(); }
function resetEnhancement(){
  enhBrightness=100;enhContrast=100;enhSharpen=0;enhInvert=false;
  document.getElementById('enh-brightness').value=100; document.getElementById('enh-contrast').value=100; document.getElementById('enh-sharpen').value=0;
  document.getElementById('enh-brightness-val').textContent='100%'; document.getElementById('enh-contrast-val').textContent='100%'; document.getElementById('enh-sharpen-val').textContent='0%';
  document.getElementById('enh-invert-btn').classList.remove('active'); render();
}
