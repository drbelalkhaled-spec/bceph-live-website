/* ── BACKUP & RESTORE ── */
let _importPending = null; // holds parsed patients before user confirms

function downloadFile(blob, filename){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(a.href);},100);
}

function buildMeasurementRows(lmSet, pxPerMm){
  const rows=[];
  const backupLm={};
  LM_IDS.forEach(id=>{backupLm[id]=landmarks[id];});
  const backupCal=pixelsPerMm;
  LM_IDS.forEach(id=>delete landmarks[id]);
  Object.keys(lmSet).forEach(id=>{landmarks[id]=lmSet[id];});
  pixelsPerMm=pxPerMm;
  ANALYSES.forEach(a=>{
    a.data.forEach(m=>{
      const {norm,sd}=getNorm(m);
      const refOnly=(norm===null||norm===undefined||sd===null||sd===undefined);
      const missingIds=m.requires.filter(id=>!has(id));
      const ok=missingIds.length===0;
      const needsCal=m.unit==='mm'&&pixelsPerMm===0&&m.name!=='LAFH Ratio'&&!m.name.includes('%');
      let value='',deviation='',status='';
      if(!ok){
        status='Missing landmarks: '+missingIds.join(', ');
      }else if(needsCal){
        status='Needs calibration';
      }else{
        const val=m.calc();
        if(isNaN(val)){
          status='N/A';
        }else{
          const r=Math.round(val*10)/10;
          value=r.toString();
          if(!refOnly){
            const dev=r-norm;
            const devA=Math.abs(dev);
            deviation=(dev>=0?'+':'')+dev.toFixed(1);
            if(devA<=sd)status='Normal';
            else if(devA<=sd*2)status='Mild';
            else status='Severe';
          }else{
            status='Ref only';
          }
        }
      }
      rows.push({analysis:a.label,measurement:m.name,value,unit:m.unit,norm:refOnly?'':String(norm),sd:refOnly?'':String(sd),deviation,status});
    });
  });
  LM_IDS.forEach(id=>delete landmarks[id]);
  Object.keys(backupLm).forEach(id=>{if(backupLm[id])landmarks[id]=backupLm[id];});
  pixelsPerMm=backupCal;
  return rows;
}

function buildCSVString(patientName,patientFileno,patientDob,patientAge,rows){
  const normSetLabel=NORM_SETS[activeNormSet]?.label||'Adult Mixed';
  const today=new Date().toISOString().slice(0,10);
  const age=patientDob?computeAge(patientDob):(patientAge||'');
  const header=[
    '# BCeph Cephalometric Analysis Export',
    '# Patient: '+(patientName||'Unknown'),
    '# File No: '+(patientFileno||'\u2014')+' | Age: '+(age||'\u2014'),
    '# Export Date: '+today+' | Norms: '+normSetLabel
  ];
  const columns=['Analysis','Measurement','Value','Unit','Norm','SD','Deviation','Status'];
  const csvLines=[
    ...header,
    columns.join(','),
    ...rows.map(r=>[
      '"'+r.analysis.replace(/"/g,'""')+'"',
      '"'+r.measurement.replace(/"/g,'""')+'"',
      r.value,r.unit,r.norm,r.sd,r.deviation,
      '"'+r.status.replace(/"/g,'""')+'"'
    ].join(','))
  ];
  return csvLines.join('\n');
}

function exportCSVCurrent(){
  const placedCount=LM_IDS.filter(id=>has(id)).length;
  if(placedCount===0){toast('No landmarks placed for current patient','\u26a0\ufe0f');return;}
  const lmSnap={};
  LM_IDS.forEach(id=>{if(has(id))lmSnap[id]=landmarks[id];});
  const rows=buildMeasurementRows(lmSnap,pixelsPerMm);
  const csv=buildCSVString(patientInfo.name,patientInfo.fileno,patientInfo.dob,patientInfo.age,rows);
  const today=new Date().toISOString().slice(0,10);
  const filename='bceph_'+(patientInfo.fileno||patientInfo.name||'export').replace(/[^a-zA-Z0-9_-]/g,'_')+'_'+today+'.csv';
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  downloadFile(blob,filename);
  closeModal('patient-modal');
  toast('CSV exported','\u2b07');
  if(typeof analytics!=='undefined')analytics.logEvent('csv_exported',{scope:'single'});
}

function exportCSVAll(){
  autoSaveCurrentPatient();
  const db=getPatientDB();
  const withTracing=db.filter(p=>p._tracing&&p._tracing.landmarks&&Object.keys(p._tracing.landmarks).length>0);
  if(withTracing.length===0){toast('No patients with landmarks to export','\u26a0\ufe0f');return;}
  const normSetLabel=NORM_SETS[activeNormSet]?.label||'Adult Mixed';
  const today=new Date().toISOString().slice(0,10);
  const allCSVBlocks=[];
  allCSVBlocks.push('# BCeph \u2014 All Patients Export');
  allCSVBlocks.push('# Export Date: '+today+' | Norms: '+normSetLabel);
  allCSVBlocks.push('# Patients: '+withTracing.length);
  allCSVBlocks.push('');
  const columns=['Patient','File No','Analysis','Measurement','Value','Unit','Norm','SD','Deviation','Status'];
  allCSVBlocks.push(columns.join(','));
  withTracing.forEach(p=>{
    const t=p._tracing;
    const lmSet=t.landmarks||{};
    const cal=t.pixelsPerMm||0;
    const rows=buildMeasurementRows(lmSet,cal);
    rows.forEach(r=>{
      allCSVBlocks.push([
        '"'+(p.name||'Unnamed').replace(/"/g,'""')+'"',
        '"'+(p.fileno||'').replace(/"/g,'""')+'"',
        '"'+r.analysis.replace(/"/g,'""')+'"',
        '"'+r.measurement.replace(/"/g,'""')+'"',
        r.value,r.unit,r.norm,r.sd,r.deviation,
        '"'+r.status.replace(/"/g,'""')+'"'
      ].join(','));
    });
  });
  const csv=allCSVBlocks.join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  downloadFile(blob,'bceph_all_patients_'+today+'.csv');
  closeModal('patient-modal');
  toast('Exported '+withTracing.length+' patients','\u2b07');
  if(typeof analytics!=='undefined')analytics.logEvent('csv_exported',{scope:'all',count:withTracing.length});
}

function copyTable(){
  const placedCount=LM_IDS.filter(id=>has(id)).length;
  if(placedCount===0){toast('Place landmarks first','\u26a0\ufe0f');return;}
  const lmSnap={};
  LM_IDS.forEach(id=>{if(has(id))lmSnap[id]=landmarks[id];});
  const rows=buildMeasurementRows(lmSnap,pixelsPerMm);
  if(rows.length===0){toast('No measurements to copy','\u26a0\ufe0f');return;}
  const columns=['Analysis','Measurement','Value','Unit','Norm','SD','Deviation','Status'];
  const tsv=[
    columns.join('\t'),
    ...rows.map(r=>[r.analysis,r.measurement,r.value,r.unit,r.norm,r.sd,r.deviation,r.status].join('\t'))
  ].join('\n');
  navigator.clipboard.writeText(tsv).then(()=>{
    toast('Copied \u2014 paste into Excel or Sheets','\ud83d\udccb');
  }).catch(()=>{
    toast('Copy failed \u2014 check browser permissions','\u26a0\ufe0f');
  });
  if(typeof analytics!=='undefined')analytics.logEvent('table_copied');
}

function exportBackup(){
  autoSaveCurrentPatient();
  const db=getPatientDB();
  if(!db.length){toast('No patients to export','⚠️');return;}
  const total=db.length;
  const withImgs=db.filter(p=>p._tracing&&p._tracing.imgData).length;
  document.getElementById('backup-summary').textContent=total+' patient'+(total===1?'':'s')+' ('+withImgs+' with X-rays)';
  document.getElementById('backup-include-images').checked=true;
  openModal('backup-modal');
}

async function doExportBackup(){
  const db=getPatientDB();
  const includeImages=document.getElementById('backup-include-images').checked;
  const clone=JSON.parse(JSON.stringify(db));
  if(includeImages){
    const allImages=await idbGetAllImages();
    const imageMap={};
    allImages.forEach(rec=>{imageMap[rec.id]=rec.imgData;});
    clone.forEach(p=>{if(p._tracing){p._tracing.imgData=imageMap[p.id]||p._tracing.imgData||null;}});
  } else {
    clone.forEach(p=>{if(p._tracing)p._tracing.imgData=null;});
  }
  const today=new Date().toISOString().slice(0,10);
  const envelope={app:'BCeph',version:'2.0',exportDate:new Date().toISOString(),includesImages:includeImages,patientCount:clone.length,patients:clone};
  const blob=new Blob([JSON.stringify(envelope,null,2)],{type:'application/json'});
  downloadFile(blob,'bceph_backup_'+today+'.json');
  closeModal('backup-modal');
  toast('Backup exported','💾');
}

function importBackup(){
  const input=document.createElement('input');
  input.type='file'; input.accept='.json';
  input.onchange=()=>{
    const file=input.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const parsed=JSON.parse(e.target.result);
        let patients, exportDate='unknown', includesImages=false;
        if(Array.isArray(parsed)){
          // Legacy raw array
          patients=parsed;
          toast('Legacy format detected — proceeding','⚠️');
        } else {
          if(parsed.app!=='BCeph'||!Array.isArray(parsed.patients)||!parsed.patients.length){
            toast('Invalid backup file','❌'); return;
          }
          patients=parsed.patients;
          exportDate=parsed.exportDate?parsed.exportDate.slice(0,10):'unknown';
          includesImages=!!parsed.includesImages;
        }
        if(!patients.length){toast('Backup contains no patients','⚠️');return;}
        _importPending=patients;
        document.getElementById('import-summary').textContent='Found '+patients.length+' patient'+(patients.length===1?'':'s')+' in backup (exported '+exportDate+')';
        document.getElementById('import-images-note').textContent='Images: '+(includesImages?'included':'not included');
        document.querySelector('input[name="import-mode"][value="replace"]').checked=true;
        openModal('import-modal');
      }catch(err){
        toast('Import failed — invalid file','❌');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

async function doImportBackup(){
  if(!_importPending){closeModal('import-modal');return;}
  try{
    const mode=document.querySelector('input[name="import-mode"]:checked').value;
    let finalDB;
    if(mode==='replace'){
      finalDB=_importPending;
    } else {
      const existing=getPatientDB();
      const existingIds=new Set(existing.map(p=>p.id));
      const toAdd=_importPending.filter(p=>!existingIds.has(p.id));
      finalDB=[...existing,...toAdd];
    }
    const imageWrites=[];
    finalDB.forEach(p=>{
      if(p._tracing&&p._tracing.imgData&&p.id){
        imageWrites.push(idbSaveImage(p.id,p._tracing.imgData));
        p._tracing.imgData=null;
      }
    });
    setPatientDB(finalDB);
    renderPatientList();
    await Promise.allSettled(imageWrites);
    if(mode==='replace'&&patientInfo.id){
      const still=finalDB.find(p=>p.id===patientInfo.id);
      if(still) loadPatientFromList(patientInfo.id);
      else { clearWorkspace(); patientInfo={id:'',name:'',fileno:'',age:'',gender:'',dob:'',xraydate:'',doctor:'',complaint:''}; updatePatientBar(); }
    }
    const count=_importPending.length;
    _importPending=null;
    closeModal('import-modal');
    toast('Imported '+count+' patient'+(count===1?'':'s'),'📂');
  }catch(err){
    _importPending=null;
    toast('Import failed — invalid file','❌');
  }
}
