/* ── FREE RULER ── */
function startRuler(){
  if(!img){ toast('Load an image first','⚠️'); return; }
  if(rulerMode > 0){ exitRuler(); return; }
  if(calibMode > 0) cancelCalibration();
  rulerMode = 1;
  rulerPts = [null, null];
  rulerMouseImg = null;
  document.getElementById('ruler-btn').classList.add('active');
  updateRulerHUD();
  toast(pixelsPerMm > 0 ? 'Click two points to measure' : 'Calibrate first for mm — showing px','📐');
  render();
}
function exitRuler(){
  rulerMode = 0;
  rulerPts = [null, null];
  rulerMouseImg = null;
  document.getElementById('ruler-btn').classList.remove('active');
  updateRulerHUD();
  render();
}
function clearRulerMeasurements(){
  rulerMeasurements.length = 0;
  if(rulerMode > 0){ rulerPts = [null, null]; rulerMode = 1; updateRulerHUD(); }
  render();
}
function finishRulerClick(){
  rulerMeasurements.push({ a: rulerPts[0], b: rulerPts[1] });
  rulerPts = [null, null];
  rulerMode = 1;
  updateRulerHUD();
  render();
}
function updateRulerHUD(){
  const hud = document.getElementById('ruler-hud');
  if(!hud) return;
  if(rulerMode === 0){ hud.classList.remove('visible'); return; }
  hud.classList.add('visible');
  const lbl = document.getElementById('ruler-hud-label');
  const val = document.getElementById('ruler-hud-dist');
  if(rulerMode === 1){
    lbl.textContent = '📐 Click FIRST point';
    val.textContent = rulerMeasurements.length > 0
      ? rulerMeasurements.length + (rulerMeasurements.length === 1 ? ' line · Esc to exit' : ' lines · Esc to exit')
      : 'Esc to exit';
  } else if(rulerMode === 2){
    lbl.textContent = '📐 Click SECOND point';
    if(rulerPts[0] && rulerMouseImg){
      const px = dist(rulerPts[0], rulerMouseImg);
      val.textContent = pixelsPerMm > 0
        ? px2mm(px).toFixed(1) + ' mm'
        : px.toFixed(0) + ' px';
    } else val.textContent = '';
  }
}
function drawRulerPoints(x){
  if(rulerMode === 0 && rulerMeasurements.length === 0) return;
  const r = Math.max(4, 5/scale);
  const fs = Math.max(10, 12/scale);
  const COLOR = '#22c55e';
  const COLOR_DIM = 'rgba(34,197,94,.65)';

  // Completed measurements
  rulerMeasurements.forEach((m, i) => {
    x.beginPath(); x.strokeStyle = COLOR; x.lineWidth = 1.5/scale; x.setLineDash([]);
    x.moveTo(m.a.x, m.a.y); x.lineTo(m.b.x, m.b.y); x.stroke();
    [m.a, m.b].forEach(p => {
      x.beginPath(); x.arc(p.x, p.y, r*0.7, 0, Math.PI*2);
      x.fillStyle = COLOR; x.fill();
      x.lineWidth = 1.2/scale; x.strokeStyle = '#fff'; x.stroke();
    });
    const px = dist(m.a, m.b);
    const label = pixelsPerMm > 0 ? px2mm(px).toFixed(1) + ' mm' : px.toFixed(0) + ' px';
    const mx = (m.a.x + m.b.x)/2, my = (m.a.y + m.b.y)/2;
    x.font = `700 ${fs}px 'IBM Plex Mono',monospace`;
    x.textAlign = 'center'; x.textBaseline = 'bottom';
    const tw = x.measureText(label).width;
    x.fillStyle = 'rgba(255,255,255,.85)';
    x.fillRect(mx - tw/2 - 4/scale, my - fs - 6/scale, tw + 8/scale, fs + 4/scale);
    x.fillStyle = COLOR; x.fillText(label, mx, my - 6/scale);
  });

  // In-progress
  if(rulerMode > 0){
    [0,1].forEach(i => {
      if(!rulerPts[i]) return;
      const p = rulerPts[i];
      x.beginPath(); x.arc(p.x, p.y, r, 0, Math.PI*2);
      x.fillStyle = COLOR; x.fill();
      x.lineWidth = 1.5/scale; x.strokeStyle = '#fff'; x.stroke();
    });
    if(rulerMode === 2 && rulerPts[0] && rulerMouseImg){
      x.beginPath(); x.strokeStyle = COLOR_DIM; x.lineWidth = 1.2/scale;
      x.setLineDash([5/scale, 4/scale]);
      x.moveTo(rulerPts[0].x, rulerPts[0].y); x.lineTo(rulerMouseImg.x, rulerMouseImg.y);
      x.stroke(); x.setLineDash([]);
      const px = dist(rulerPts[0], rulerMouseImg);
      const label = pixelsPerMm > 0 ? px2mm(px).toFixed(1) + ' mm' : px.toFixed(0) + ' px';
      const mx = (rulerPts[0].x + rulerMouseImg.x)/2, my = (rulerPts[0].y + rulerMouseImg.y)/2;
      x.font = `700 ${fs}px 'IBM Plex Mono',monospace`;
      x.fillStyle = COLOR; x.textAlign = 'center'; x.textBaseline = 'bottom';
      x.fillText(label, mx, my - 6/scale);
    }
  }
}
