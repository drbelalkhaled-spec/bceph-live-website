/* ── UNDO / REDO ── */
function snapshotLandmarks(){ return JSON.parse(JSON.stringify(landmarks)); }
function pushUndoState(){ undoStack.push(snapshotLandmarks()); if(undoStack.length>80)undoStack.shift(); redoStack.length=0; updateUndoRedoUI(); }
function undoLandmark(){
  if(!undoStack.length){toast('Nothing to undo','↩');return;}
  const currentSnap=snapshotLandmarks();
  redoStack.push(currentSnap);
  const prev=undoStack.pop();
  // Find which landmark was placed/changed — select it so user can re-place
  const removedId=LM_IDS.find(id=>currentSnap[id]&&!prev[id])
    ||LM_IDS.find(id=>currentSnap[id]&&JSON.stringify(currentSnap[id])!==JSON.stringify(prev[id]));
  LM_IDS.forEach(id=>delete landmarks[id]);
  Object.keys(prev).forEach(id=>{landmarks[id]=prev[id];});
  if(removedId) selectLandmark(removedId);
  updateAllUI();render();updateUndoRedoUI();toast('Undo','↩');
}
function redoLandmark(){ if(!redoStack.length){toast('Nothing to redo','↪');return;} undoStack.push(snapshotLandmarks()); const next=redoStack.pop(); LM_IDS.forEach(id=>delete landmarks[id]); Object.keys(next).forEach(id=>{landmarks[id]=next[id];}); updateAllUI();render();updateUndoRedoUI();toast('Redo','↪'); }
function updateUndoRedoUI(){ const u=document.getElementById('undo-btn'),r=document.getElementById('redo-btn'); if(u)u.classList.toggle('disabled',undoStack.length===0); if(r)r.classList.toggle('disabled',redoStack.length===0); }
