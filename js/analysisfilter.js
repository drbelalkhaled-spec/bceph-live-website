/* ── ANALYSIS FILTER ── */
// Initialized in buildUI() after ANALYSES is available
let activeAnalysisKeys = null;
// Core landmarks always included (for Overview classification)
const CORE_LM_IDS = ['S','N','A','B','ANS','PNS','Go','Gn','Me','Po','Or','Pg'];
function getRequiredLandmarkIds(){
  const ids = new Set(CORE_LM_IDS);
  ANALYSES.forEach(a=>{
    if(activeAnalysisKeys&&activeAnalysisKeys.has(a.key)){
      a.data.forEach(m=>m.requires.forEach(id=>ids.add(id)));
    }
  });
  return ids;
}
function toggleAnalysisFilter(key){
  if(!activeAnalysisKeys) return;
  const wasOn = activeAnalysisKeys.has(key);
  if(wasOn) activeAnalysisKeys.delete(key);
  else activeAnalysisKeys.add(key);
  updateAnalysisFilterUI();
  rebuildLandmarkSelector();
  updateLandmarkUI();
  // If we just ENABLED a new analysis, jump cursor to first unplaced landmark it needs
  if(!wasOn){
    const analysis = ANALYSES.find(a=>a.key===key);
    if(analysis){
      const newLmIds = new Set();
      analysis.data.forEach(m=>m.requires.forEach(id=>newLmIds.add(id)));
      const first = LM_DEFS.find(d=>newLmIds.has(d.id)&&!has(d.id)&&!skippedLandmarks.has(d.id));
      if(first) selectLandmark(first.id);
    }
  }
}
function setAllAnalyses(on){
  if(!activeAnalysisKeys) return;
  if(on) ANALYSES.forEach(a=>activeAnalysisKeys.add(a.key));
  else activeAnalysisKeys.clear();
  updateAnalysisFilterUI();
  rebuildLandmarkSelector();
  updateLandmarkUI();
  // When enabling all, jump to the first globally unplaced required landmark
  if(on){
    const required=getRequiredLandmarkIds();
    const first=LM_DEFS.find(d=>required.has(d.id)&&!has(d.id)&&!skippedLandmarks.has(d.id));
    if(first) selectLandmark(first.id);
  }
}
function updateAnalysisFilterUI(){
  ANALYSES.forEach(a=>{
    const el=document.getElementById('af-pill-'+a.key);
    if(el) el.classList.toggle('active', activeAnalysisKeys.has(a.key));
  });
}
function rebuildLandmarkSelector(){
  const required=getRequiredLandmarkIds();
  const sel=document.getElementById('landmark-selector');
  sel.innerHTML=LM_DEFS.filter(d=>required.has(d.id)).map(d=>`<option value="${d.id}">${d.abbr} — ${d.name}</option>`).join('');
  if(!sel.value||!required.has(sel.value)){
    const first=LM_DEFS.find(d=>required.has(d.id)&&!has(d.id)&&!skippedLandmarks.has(d.id));
    if(first){ activeLandmark=first.id; sel.value=first.id; const def=LM_DEFS.find(d=>d.id===first.id); document.getElementById('lm-hint').textContent=def?def.desc:''; }
  } else { sel.value=activeLandmark; }
}
