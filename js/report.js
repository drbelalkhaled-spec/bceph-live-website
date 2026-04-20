/* ── REPORT INTERPRETATION LOOKUP ── */
// Keys match measurement names exactly. Each entry has lo (below normal) and hi (above normal).
// null = no distinct clinical meaning in that direction.
const REPORT_INTERP = {
  // Eastman / Steiner shared
  'SNA':               {lo:'Maxillary retrusion.', hi:'Maxillary protrusion.'},
  'SNB':               {lo:'Mandibular retrusion.', hi:'Mandibular protrusion.'},
  'ANB':               {lo:'Skeletal Class III tendency.', hi:'Skeletal Class II tendency.'},
  'SN–MaxP':           {lo:'Low maxillary plane inclination.', hi:'Increased maxillary plane inclination.'},
  'MMPA':              {lo:'Hypodivergent pattern.', hi:'Hyperdivergent pattern.'},
  'U1–MaxP':           {lo:'Upper incisor retrusion to maxillary plane.', hi:'Upper incisor protrusion to maxillary plane.'},
  'L1–MandP':          {lo:'Lower incisor retrusion to mandibular plane.', hi:'Lower incisor protrusion to mandibular plane.'},
  'Interincisal':      {lo:'Excessive incisor proclination.', hi:'Incisor retroclination tendency.'},
  'U1–NA (mm)':        {lo:'Upper incisor retrusion.', hi:'Upper incisor protrusion.'},
  'L1–NB (mm)':        {lo:'Lower incisor retrusion.', hi:'Lower incisor protrusion.'},
  'LAFH Ratio':        {lo:'Decreased lower anterior face height.', hi:'Increased lower anterior face height.'},
  // Steiner-specific
  'GoGn–SN':           {lo:'Hypodivergent (deep bite) pattern.', hi:'Hyperdivergent (open bite) pattern.'},
  'U1–NA (°)':         {lo:'Upper incisor retrusion.', hi:'Upper incisor protrusion.'},
  'L1–NB (°)':         {lo:'Lower incisor retrusion.', hi:'Lower incisor protrusion.'},
  // Downs
  'Facial Angle':      {lo:'Retrognathic mandible.', hi:'Prognathic mandible.'},
  'Convexity':         {lo:'Concave facial profile.', hi:'Convex facial profile.'},
  'A–B Plane':         {lo:'Class III jaw relationship.', hi:'Class II jaw relationship.'},
  'Mand Plane (FH)':   {lo:'Hypodivergent jaw pattern.', hi:'Hyperdivergent jaw pattern.'},
  'Y-Axis':            {lo:'Backward mandibular rotation.', hi:'Forward mandibular rotation.'},
  // Tweed
  'FMA':               {lo:'Hypodivergent (deep bite) pattern.', hi:'Hyperdivergent (open bite) pattern.'},
  'FMIA':              {lo:'Lower incisor protrusion.', hi:'Excessive lower incisor retrusion.'},
  'IMPA':              {lo:'Lower incisor retrusion to mandible.', hi:'Lower incisor protrusion to mandible.'},
  // McNamara
  'Upper Face Ht (N–ANS)':    {lo:'Decreased upper facial height.', hi:'Increased upper facial height.'},
  'Lower Face Ht (ANS–Me)':   {lo:'Decreased lower facial height.', hi:'Increased lower facial height.'},
  'A to N-Perp':       {lo:'Maxillary retrusion to nasion perpendicular.', hi:'Maxillary protrusion to nasion perpendicular.'},
  'Pg to N-Perp':      {lo:'Mandibular retrusion to nasion perpendicular.', hi:'Mandibular protrusion to nasion perpendicular.'},
  // Björk-Jarabak
  'Saddle Angle (N-S-Ar)':        {lo:null, hi:'Increased posterior cranial base angulation.'},
  'Articular Angle (S-Ar-Go)':    {lo:null, hi:'Decreased posterior condylar angle.'},
  'Gonial Angle (Ar-Go-Me)':      {lo:'Closed gonial angle — horizontal growth tendency.', hi:'Open gonial angle — vertical growth tendency.'},
  'Upper Gonial (Ar-Go-N)':       {lo:'Reduced upper gonial angle.', hi:'Increased upper gonial angle.'},
  'Lower Gonial (N-Go-Me)':       {lo:'Reduced lower gonial angle.', hi:'Increased lower gonial angle.'},
  'Sum of Angles':                 {lo:'Forward mandibular rotation — hypodivergent.', hi:'Backward mandibular rotation — hyperdivergent.'},
  'Post Face Ht (S-Go)':          {lo:'Short posterior face height — vertical pattern.', hi:null},
  'Ant Face Ht (N-Me)':           {lo:'Decreased anterior facial height.', hi:'Increased anterior facial height.'},
  'PFH/AFH Ratio':                {lo:'Vertical growth pattern.', hi:'Horizontal growth pattern.'},
  // Ricketts
  'Facial Axis (Ba-N to Pt-Gn)':  {lo:'Brachyfacial growth tendency.', hi:'Dolichofacial growth tendency.'},
  'Facial Depth (FH to N-Pg)':    {lo:'Mandibular retrusion (Class II).', hi:'Mandibular protrusion (Class III).'},
  'Mandibular Plane to FH':        {lo:'Hypodivergent pattern.', hi:'Hyperdivergent pattern.'},
  'Lower Face Ht % (ANS-Me/N-Me)':{lo:'Decreased vertical dimension.', hi:'Increased vertical dimension.'},
  'Convexity A to N-Pg':           {lo:'Straight or concave skeletal profile.', hi:'Convex skeletal profile.'},
  'U1 to A-Po (mm)':              {lo:'Upper incisor retrusion to A-Po line.', hi:'Upper incisor protrusion to A-Po line.'},
  'L1 to A-Po (mm)':              {lo:'Lower incisor retrusion to A-Po line.', hi:'Lower incisor protrusion to A-Po line.'},
  'L1 to A-Po (°)':               {lo:'Lower incisor retrusion to A-Po line.', hi:'Lower incisor protrusion to A-Po line.'},
  'U1 to FH (°)':                  {lo:'Upper incisor retrusion to FH.', hi:'Upper incisor protrusion to FH.'},
  'Interincisal (U1–L1)':          {lo:'Excessive incisor proclination.', hi:'Incisor retroclination tendency.'},
  // Wits
  'Wits Appraisal (AO–BO)':       {lo:'Skeletal Class III pattern.', hi:'Skeletal Class II pattern.'},
  // Holdaway
  'H-Angle (H-line to NB)':        {lo:'Retrusive soft tissue profile.', hi:'Protrusive soft tissue profile.'},
  'Nose Prominence to H-Line':      {lo:'Deficient nasal projection.', hi:'Excess nasal projection.'},
  'Lower Lip to H-Line':            {lo:'Retruded lower lip.', hi:'Protruded lower lip.'},
  'Soft Tissue Convexity (Prn–Sn–sPg)':{lo:'Skeletal/soft tissue concavity.', hi:'Skeletal/soft tissue convexity.'},
  'ST Facial Angle (FH–N–sPg)':    {lo:'Retrusive chin soft tissue profile.', hi:'Protrusive chin soft tissue profile.'},
  'UL Protrusion (Ls–A, FH proj)': {lo:'Deficient upper lip protrusion.', hi:'Excessive upper lip protrusion.'},
  "Mentolabial Sulcus Depth (Me')": {lo:'Shallow mentolabial sulcus.', hi:'Deep mentolabial sulcus.'},
  'Nasolabial Angle (Prn–Sn–Ls)':  {lo:'Acute nasolabial angle — protrusive lip base.', hi:'Obtuse nasolabial angle — retrusive lip base.'},
  // E-Line
  'Upper Lip to E-Line':           {lo:'Upper lip retrusion to E-line.', hi:'Upper lip protrusion to E-line.'},
  'Lower Lip to E-Line':           {lo:'Lower lip retrusion to E-line.', hi:'Lower lip protrusion to E-line.'},
  // Kim
  'ODI':                           {lo:'Skeletal open bite tendency.', hi:'Skeletal deep bite tendency.'},
  'APDI':                          {lo:'Class II (distal) skeletal pattern.', hi:'Class III (mesial) skeletal pattern.'},
  'CF (ODI+APDI)':                 {lo:'Open bite and Class II tendency.', hi:'Deep bite and Class III tendency.'},
  // Steiner addition
  'Occ Plane to SN':               {lo:'Flat occlusal plane.', hi:'Steep occlusal plane.'},
  // Eastman additions
  'Upper AFH (N–ANS)':             {lo:'Decreased upper facial height.', hi:'Increased upper facial height.'},
  'Lower AFH (ANS–Me)':            {lo:'Decreased lower facial height.', hi:'Increased lower facial height.'},
  'L1 to A-Pog (mm)':              {lo:'Retruded lower incisor.', hi:'Protruded lower incisor.'},
  'Nasolabial Angle':              {lo:'Acute nasolabial angle — protruded upper lip.', hi:'Obtuse nasolabial angle — retruded upper lip.'},
  'Lower Lip to E-Plane':          {lo:'Retruded lower lip.', hi:'Protruded lower lip.'},
  // Downs additions
  'Interincisal Angle':            {lo:'Excessive incisor proclination.', hi:'Retroclined incisors.'},
  'Incisor Occ Plane Angle':       {lo:'Retroclined lower incisor.', hi:'Proclined lower incisor relative to occlusal plane.'},
  'Incisor Mand Plane Angle':      {lo:'Retroclined lower incisor to mandibular plane.', hi:'Proclined lower incisor to mandibular plane.'},
  'U1 to A-Pog (mm)':              {lo:'Retruded upper incisor.', hi:'Protruded upper incisor or retruded chin point.'},
  'Cant of Occ Plane':             {lo:'Flat occlusal plane to FH.', hi:'Steep occlusal plane to FH.'},
  // McNamara additions
  'Eff. Length Maxilla (Co–A)':    {lo:'Maxillary retrognathism (short maxilla).', hi:'Maxillary prognathism.'},
  'Eff. Length Mandible (Co–Gn)':  {lo:'Mandibular retrognathism (short mandible).', hi:'Mandibular prognathism.'},
  'Maxillomand. Differential':     {lo:'Small mandibular length relative to maxilla.', hi:'Large mandibular length relative to maxilla.'},
  'Mand Plane Angle (McNamara)':   {lo:'Hypodivergent pattern.', hi:'Hyperdivergent pattern.'},
  'Facial Axis Angle':             {lo:'Brachyfacial tendency (closing axis).', hi:'Dolichofacial tendency (opening axis).'},
  'U1 to A Vertical':              {lo:'Retruded upper incisor relative to maxilla.', hi:'Protruded upper incisor relative to maxilla.'},
  'SNA (McNamara)':                {lo:'Maxillary retrusion.', hi:'Maxillary protrusion.'},
  'L1 to A-Pog (McNamara)':        {lo:'Retruded lower incisor.', hi:'Protruded lower incisor.'},
  // Björk-Jarabak additions
  'Ant. Cranial Base (S–N)':       {lo:'Small anterior cranial base.', hi:'Large anterior cranial base.'},
  'Post. Cranial Base (S–Ar)':     {lo:'Small posterior cranial base.', hi:'Large posterior cranial base.'},
  'Ramus Height (Ar–Go)':          {lo:'Short ramus — vertical growth pattern.', hi:'Long ramus — horizontal growth.'},
  'Mand. Body Length (Go–Gn)':     {lo:'Short mandibular body.', hi:'Long mandibular body.'},
  'Facial Depth (N–Go)':           {lo:'Small facial depth.', hi:'Large facial depth.'},
  'Facial Length (S–Gn)':          {lo:'Short total facial length.', hi:'Long total facial length.'},
  'Body/Cranial Base Ratio':       {lo:'Short mandibular body relative to cranial base.', hi:'Long mandibular body relative to cranial base.'},
  'SN–GoMe':                       {lo:'Hypodivergent jaw pattern.', hi:'Hyperdivergent jaw pattern.'},
  'Y-Axis to SN':                  {lo:'Forward mandibular rotation.', hi:'Backward mandibular rotation.'},
  'Facial Plane (N–Pog)':          {lo:'Retruded chin — Skeletal Class II.', hi:'Protruded chin — Skeletal Class III.'},
  'Facial Convexity':              {lo:'Flat/concave facial profile.', hi:'Convex facial profile — prominent maxilla.'},
  'U1 to SN':                      {lo:'Retruded upper incisor to SN.', hi:'Protruded upper incisor to SN.'},
  'Occ Plane to Go-Me':            {lo:'Flat occlusal plane relative to mandibular plane.', hi:'Steep occlusal plane relative to mandibular plane.'},
  // Ricketts additions
  'Facial Taper':                  {lo:'Short symphysis — narrow face.', hi:'Long symphysis — wide face.'},
  'Mandibular Arc':                {lo:'Retrognathic mandibular shape.', hi:'Prognathic mandibular shape.'},
  'Palatal Plane Angle':           {lo:'Counter-clockwise rotated maxilla.', hi:'Clockwise rotated maxilla.'},
  'Denture Height (LAFH)':         {lo:'Decreased lower facial height.', hi:'Increased lower facial height — open bite tendency.'},
  'Upper Molar to PtV':            {lo:'Mesially positioned upper molar.', hi:'Distally positioned upper molar.'},
  // Kim additions
  'A-B to Mand Plane':             {lo:'Skeletal open bite.', hi:'Skeletal deep bite.'},
  'Palatal Plane Angle (Kim)':     {lo:'Counter-clockwise rotated maxilla.', hi:'Clockwise rotated maxilla.'},
  'Facial Angle':                  {lo:'Retrognathic mandible.', hi:'Prognathic mandible.'},
  'A-B Plane Angle':               {lo:'Class III jaw relationship.', hi:'Class II jaw relationship.'},
  'Upper Lip to E-Plane':          {lo:'Retruded upper lip.', hi:'Protruded upper lip.'},
  'Lower Lip to E-Plane (Kim)':    {lo:'Retruded lower lip.', hi:'Protruded lower lip.'},
};

/* ── REPORT ── */
function generateReport(){
  const n=LM_IDS.filter(id=>has(id)).length;
  if(n<4){toast('Place at least S, N, A, B','⚠️');return;}
  // Sync checkboxes to currently active analysis filter
  ANALYSES.forEach(a=>{
    const cb=document.getElementById('ropt-'+a.key);
    if(cb){ cb.checked = activeAnalysisKeys ? activeAnalysisKeys.has(a.key) : true; }
    updateReportOptStyle(a.key);
  });
  document.getElementById('ropt-warning').style.display='none';
  openModal('report-modal');
}
function selectAllAnalyses(state){ ANALYSES.forEach(a=>{ const cb=document.getElementById('ropt-'+a.key); if(cb) cb.checked=state; updateReportOptStyle(a.key); }); }
function confirmAndGenerateReport(){
  checkAuthGate();
  if (!currentUser && getUseCount() >= FREE_USES) return;
  const sel={image:document.getElementById('ropt-image').checked, summary:document.getElementById('ropt-summary').checked, barchart:document.getElementById('ropt-barchart').checked};
  ANALYSES.forEach(a=>{ sel[a.key]=document.getElementById('ropt-'+a.key).checked; });
  if(!ANALYSES.some(a=>sel[a.key])){ document.getElementById('ropt-warning').style.display='block'; return; }
  closeModal('report-modal'); buildReport(sel);
}

function buildReport(sel){
  if(currentUser && typeof analytics!=='undefined') analytics.logEvent('report_exported');
  if (currentUser) {
    const selectedAnalyses = ANALYSES.filter(a => sel[a.key]).map(a => a.key);
    const userRef = db.collection('users').doc(currentUser.uid);
    userRef.set({ totalReports: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    selectedAnalyses.forEach(key => {
      userRef.set({
        analysisUsage: { [key]: firebase.firestore.FieldValue.increment(1) }
      }, { merge: true });
    });
  }
  const today=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
  const notes=document.getElementById('notes-area').value;
  const normSetLabel=NORM_SETS[activeNormSet]?.label||'Adult Mixed';

  function devBar(val,norm,sd){
    if(!sel.barchart||isNaN(parseFloat(val)))return'';
    const v=parseFloat(val);
    const deviations=(v-norm)/sd;
    const pct=Math.max(2,Math.min(98,(deviations+3)/6*100));
    const color=Math.abs(deviations)<=1?'#22c55e':Math.abs(deviations)<=2?'#f59e0b':'#ef4444';
    return `<div style="margin:2px 0 8px;position:relative;height:8px;background:#e8edf5;border-radius:4px">
      <div style="position:absolute;left:33.3%;width:33.4%;height:100%;background:#d0d8ea;border-radius:2px"></div>
      <div style="position:absolute;left:${pct}%;transform:translateX(-50%);top:-2px;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>
      <div style="position:absolute;bottom:-14px;left:0;font-size:7pt;color:#94a3b8">−3SD</div>
      <div style="position:absolute;bottom:-14px;left:33%;transform:translateX(-50%);font-size:7pt;color:#94a3b8">−1SD</div>
      <div style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:7pt;color:#94a3b8;font-weight:700">N</div>
      <div style="position:absolute;bottom:-14px;left:67%;transform:translateX(-50%);font-size:7pt;color:#94a3b8">+1SD</div>
      <div style="position:absolute;bottom:-14px;right:0;font-size:7pt;color:#94a3b8">+3SD</div>
    </div>`;
  }

  function tblHTML(title, arr){
    const rows=arr.map(m=>{
      const ok=m.requires.every(id=>has(id)); let val='—',ds='—',dc='#64748b',numVal=NaN;
      const {norm,sd}=getNorm(m);
      const refOnly=(norm===null||norm===undefined||sd===null||sd===undefined);
      const normText=refOnly?'ref only':norm+m.unit+' ±'+sd;
      if(ok&&!(m.unit==='mm'&&pixelsPerMm===0&&!m.name.includes('%')&&m.name!=='LAFH Ratio')){
        const v=m.calc(); if(!isNaN(v)){
          numVal=Math.round(v*10)/10; val=numVal+m.unit;
          if(!refOnly){
            const dv=numVal-norm; ds=(dv>=0?'+':'')+dv.toFixed(1);
            const da=Math.abs(dv); dc=da<=sd?'#22c55e':da<=sd*2?'#f59e0b':'#ef4444';
          }
        }
      }
      // ── INTERPRETATION (report only) ──
      let interpHTML='';
      if(!refOnly&&!isNaN(numVal)){
        const entry=REPORT_INTERP[m.name];
        const {norm:n2,sd:s2}=getNorm(m);
        const dv=numVal-n2;
        if(entry&&Math.abs(dv)>s2){
          const txt=dv<0?entry.lo:entry.hi;
          if(txt) interpHTML='<span style="color:#c8982a;font-style:italic;font-size:0.88em;margin-left:4px">'+txt+'</span>';
        }
      }
      // Special EI interpretation (ref-only threshold-based)
      if(m.name==='EI (Extraction Index)'&&!isNaN(numVal)){
        let eiTxt='';
        // TODO: Validate EI thresholds against Kim 1978 after formula correction
        if(numVal>=161) eiTxt='Non-extraction case indicated.';
        else if(numVal<=155) eiTxt='Extraction indicated.';
        else eiTxt='Borderline — consider soft tissue and growth.';
        interpHTML='<span style="color:#c8982a;font-style:italic;font-size:0.88em;margin-left:4px">'+eiTxt+'</span>';
      }
      const barHTML=refOnly?'':devBar(numVal,norm,sd);
      const bdrB=barHTML?'':'border-bottom:1px solid #e2e8f0;';
      return '<tr><td style="padding:5px 8px;'+bdrB+'font-weight:600">'+m.name+'</td>'
        +'<td style="padding:5px 8px;'+bdrB+'text-align:right;font-family:monospace">'+val+interpHTML+'</td>'
        +'<td style="padding:5px 8px;'+bdrB+'text-align:right;color:#64748b;font-size:10pt">'+normText+'</td>'
        +'<td style="padding:5px 8px;'+bdrB+'text-align:right;font-family:monospace;font-weight:600;color:'+dc+'">'+ds+'</td></tr>'
        +(barHTML?'<tr><td colspan="4" style="padding:0 8px 20px;border-bottom:1px solid #e2e8f0">'+barHTML+'</td></tr>':'');
    }).join('');
    return '<h3 style="color:#1b2d5b;margin:18px 0 8px;font-size:13pt;border-bottom:2px solid #c8982a;padding-bottom:4px">'+title+'</h3>'
      +'<table style="width:100%;border-collapse:collapse;font-size:10.5pt">'
      +'<tr style="background:#f8fafc"><th style="padding:5px 8px;text-align:left;font-size:9pt;color:#64748b">Measurement</th><th style="padding:5px 8px;text-align:right;font-size:9pt;color:#64748b">Value</th><th style="padding:5px 8px;text-align:right;font-size:9pt;color:#64748b">Norm ('+normSetLabel+')</th><th style="padding:5px 8px;text-align:right;font-size:9pt;color:#64748b">Dev</th></tr>'
      +rows+'</table>';
  }

  let cimg='';
  if(sel.image&&img){
    const tc=document.createElement('canvas'), tx=tc.getContext('2d');
    tc.width=imgW; tc.height=imgH; tx.drawImage(img,0,0,imgW,imgH); tx.lineWidth=2;
    [{a:'S',b:'N',c:'#22d3ee'},{a:'N',b:'A',c:'#3b82f6'},{a:'N',b:'B',c:'#60a5fa'},{a:'Po',b:'Or',c:'#f59e0b'},{a:'Go',b:'Me',c:'#ef4444'},{a:'ANS',b:'PNS',c:'#22c55e'},{a:'U1A',b:'U1T',c:'#d946ef'},{a:'L1A',b:'L1T',c:'#fb7185'},{a:'N',b:'Pg',c:'#8b5cf6'},{a:'S',b:'Ar',c:'#10b981'},{a:'Ar',b:'Go',c:'#10b981'},{a:'Ba',b:'N',c:'#a78bfa'},{a:'Pt',b:'Gn',c:'#67e8f9'},{a:'sPg',b:'Ls',c:'#facc15'}].forEach(ln=>{
      if(!has(ln.a)||!has(ln.b))return; tx.beginPath(); tx.strokeStyle=ln.c; tx.globalAlpha=0.8; tx.moveTo(L(ln.a).x,L(ln.a).y); tx.lineTo(L(ln.b).x,L(ln.b).y); tx.stroke();
    });
    tx.globalAlpha=1;
    LM_DEFS.forEach(d=>{ if(!has(d.id))return; const p=L(d.id); tx.beginPath(); tx.arc(p.x,p.y,5,0,Math.PI*2); tx.fillStyle=d.color; tx.fill(); tx.strokeStyle='#000'; tx.lineWidth=1; tx.stroke(); tx.font='600 12px sans-serif'; tx.fillStyle=d.color; tx.fillText(d.abbr,p.x+8,p.y-8); });
    cimg=tc.toDataURL('image/jpeg',0.85);
  }

  const pi=patientInfo, piAge=pi.dob?computeAge(pi.dob):(pi.age||'');
  const hasPI=pi.name||pi.fileno||piAge;
  let piHTML='';
  if(hasPI){
    const piRows=[];
    if(pi.name) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt;width:130px">Patient Name</td><td style="padding:3px 10px;font-weight:700;color:#1b2d5b;font-size:10.5pt">'+pi.name.replace(/</g,'&lt;')+'</td></tr>');
    if(pi.fileno) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">File No.</td><td style="padding:3px 10px;font-family:monospace;color:#1b2d5b;font-size:10.5pt">'+pi.fileno.replace(/</g,'&lt;')+'</td></tr>');
    if(piAge) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">Age</td><td style="padding:3px 10px;color:#1b2d5b;font-size:10.5pt">'+piAge+'</td></tr>');
    if(pi.gender) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">Gender</td><td style="padding:3px 10px;color:#1b2d5b;font-size:10.5pt">'+pi.gender+'</td></tr>');
    if(pi.xraydate) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">X-Ray Date</td><td style="padding:3px 10px;color:#1b2d5b;font-size:10.5pt">'+new Date(pi.xraydate+'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})+'</td></tr>');
    if(pi.doctor) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">Ref. Doctor</td><td style="padding:3px 10px;color:#1b2d5b;font-size:10.5pt">'+pi.doctor.replace(/</g,'&lt;')+'</td></tr>');
    if(pi.complaint) piRows.push('<tr><td style="padding:3px 10px;font-weight:600;color:#64748b;font-size:9.5pt">Complaint</td><td style="padding:3px 10px;color:#1b2d5b;font-size:10.5pt">'+pi.complaint.replace(/</g,'&lt;')+'</td></tr>');
    piHTML='<div style="margin:12px 0 16px;padding:12px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc"><table style="border-collapse:collapse;width:100%">'+piRows.join('')+'</table></div>';
  }

  const badges=ANALYSES.filter(a=>sel[a.key]).map(a=>'<span style="display:inline-block;padding:2px 8px;background:#e8f0fd;color:#1b2d5b;border-radius:10px;font-size:8.5pt;font-weight:700;margin:2px">'+a.label+'</span>').join('');
  const normBadge='<span style="display:inline-block;padding:2px 8px;background:#fdf6e3;color:#92400e;border-radius:10px;font-size:8.5pt;font-weight:700;margin:2px">Norms: '+normSetLabel+'</span>';
  const v2Badge='<span style="display:inline-block;padding:2px 8px;background:#ecfdf5;color:#065f46;border-radius:10px;font-size:8.5pt;font-weight:700;margin:2px">BCeph v2</span>';
  const sumT=document.getElementById('summary-text').textContent;

  const w=window.open('','_blank');
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BCeph Report</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Plus Jakarta Sans",sans-serif;font-size:11pt;color:#1e293b;line-height:1.5;background:#e8ecf0}#tb{position:fixed;top:0;left:0;right:0;z-index:999;background:#1b2d5b;padding:10px 24px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,.3)}.tbr{font-size:14px;font-weight:700;color:white;margin-right:auto}.tbr span{color:#c8982a}.bt{height:34px;padding:0 18px;border:none;border-radius:6px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer}.bp{background:#c8982a;color:#1b2d5b}.bg{background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.15)}#pw{padding:68px 32px 48px;display:flex;justify-content:center}#rp{background:white;width:210mm;min-height:297mm;padding:20mm;box-shadow:0 4px 24px rgba(0,0,0,.18);border-radius:2px}@media print{#tb{display:none!important}body{background:white}#pw{padding:0;display:block}#rp{box-shadow:none;width:100%;min-height:unset;padding:15mm}}</style></head><body>'
    +'<div id="tb"><div class="tbr"><span>B</span>Ceph Report</div><button class="bt bp" onclick="window.print()">🖨 Print / PDF</button><button class="bt bg" onclick="window.close()">✕ Close</button></div>'
    +'<div id="pw"><div id="rp">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #c8982a">'
    +'<div><div style="font-size:22pt;font-weight:800;color:#1b2d5b;letter-spacing:-0.5px"><span style="color:#c8982a">B</span>Ceph</div>'
    +'<div style="font-size:9pt;color:#64748b;margin-top:2px;letter-spacing:0.5px">BAYAN Healthcare Analytics · Cephalometric Analysis Report</div>'
    +'<div style="margin-top:6px">'+badges+normBadge+'</div></div>'
    +(function(){if(!pi.fileno)return'<div style="text-align:right;font-size:10pt;color:#64748b">'+today+'</div>';var qrDataUrl=generateQRDataUrl(pi.fileno);return'<div style="text-align:right">'+(qrDataUrl?'<img src="'+qrDataUrl+'" style="width:2.5cm;height:2.5cm;display:block;margin-left:auto;image-rendering:pixelated;image-rendering:crisp-edges"><div style="font-size:7pt;color:#94a3b8;text-align:center;margin-top:3px"># '+pi.fileno.replace(/</g,'&lt;')+'</div>':'')+'<div style="font-size:9pt;color:#64748b;margin-top:4px">'+today+'</div></div>';}())+'</div>'
    +piHTML
    +(cimg?'<div style="text-align:center;margin:16px 0"><img src="'+cimg+'" style="max-width:100%;max-height:320px;border:1px solid #e2e8f0;border-radius:4px"></div>':'')
    +(sel.summary?'<div style="background:#fdf6e3;border-left:3px solid #c8982a;padding:10px 14px;font-style:italic;margin:12px 0;font-size:10.5pt">'+sumT+'</div>':'')
    +ANALYSES.filter(a=>sel[a.key]).map(a=>tblHTML(a.label,a.data)).join('')
    +(notes?'<h3 style="color:#1b2d5b;margin:18px 0 8px;font-size:13pt;border-bottom:2px solid #c8982a;padding-bottom:4px">Clinical Notes</h3><p style="font-size:10.5pt;white-space:pre-wrap">'+notes.replace(/</g,'&lt;')+'</p>':'')
    +'<div style="margin-top:32px;padding-top:12px;border-top:1px solid #cbd5e1;text-align:center"><p style="font-size:8.5pt;color:#94a3b8">Generated by <strong style="color:#c8982a">BCeph</strong> · BAYAN Healthcare Analytics</p><p style="font-size:8.5pt;color:#94a3b8;margin-top:3px">Inquiries, suggestions &amp; support: <a href="mailto:team@bceph.com" style="color:#c8982a;text-decoration:none">team@bceph.com</a></p></div>'
    +'</div></div><script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"BCeph Cephalometric Analysis Tool","applicationCategory":"MedicalApplication","operatingSystem":"Web Browser","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Free browser-based cephalometric analysis tool for orthodontists.","url":"https://www.bceph.com/app.html","author":{"@type":"Organization","name":"Bayan Healthcare Analytics"}}<\/script></body></html>');
  w.document.close(); w.focus(); toast('Report opened','📄');
}
