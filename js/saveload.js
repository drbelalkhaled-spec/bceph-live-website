/* ── SAVE / LOAD ── */
function saveLandmarks(){
  if(patientInfo.id){ autoSaveCurrentPatient(); toast('Saved to patient: '+(patientInfo.name||patientInfo.fileno),'💾'); return; }
  const d={landmarks:{},pixelsPerMm:pixelsPerMm,notes:document.getElementById('notes-area').value,imgData:getImageForStorage()};
  LM_IDS.forEach(id=>{if(has(id))d.landmarks[id]=L(id);});
  try{ localStorage.setItem('bceph_data',JSON.stringify(d)); toast('Saved (no patient)','💾'); }
  catch(e){ d.imgData=null; try{localStorage.setItem('bceph_data',JSON.stringify(d));toast('Saved (no image — storage limit)','⚠️');}catch(e2){toast('Storage full','❌');} }
}
function loadLandmarks(){
  const raw=localStorage.getItem('bceph_data'); if(!raw){toast('No saved session','⚠️');return;}
  try{
    const d=JSON.parse(raw); Object.keys(d.landmarks||{}).forEach(id=>{landmarks[id]=d.landmarks[id];});
    if(d.pixelsPerMm){pixelsPerMm=d.pixelsPerMm;const s=document.getElementById('calib-status');s.textContent=pixelsPerMm.toFixed(2)+' px/mm';s.className='set';}
    if(d.notes) document.getElementById('notes-area').value=d.notes;
    if(d.imgData){ imgDataURL=d.imgData; img=new Image(); img.onload=()=>{ imgW=img.naturalWidth; imgH=img.naturalHeight; document.getElementById('no-image-msg').style.display='none'; resetView(); }; img.src=d.imgData; }
    updateAllUI(); render(); toast('Restored','📂');
  }catch(e){toast('Load failed','❌');}
}
function clearAllLandmarks(){ if(!confirm('Clear all landmarks?'))return; LM_IDS.forEach(id=>delete landmarks[id]); updateAllUI(); render(); selectLandmark('S'); toast('Cleared','🗑'); }
