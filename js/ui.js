/* ── BUILD UI ── */
function buildUI(){
  /* Init analysis filter — all active by default */
  activeAnalysisKeys = new Set(ANALYSES.map(a=>a.key));

  /* Inject analysis filter pills */
  const afBar=document.getElementById('analysis-filter-bar');
  ANALYSES.forEach(a=>{
    const btn=document.createElement('button');
    btn.className='af-pill active';
    btn.id='af-pill-'+a.key;
    btn.textContent=a.label.replace(' Analysis','').replace('-Jarabak','').replace(' Soft Tissue','').replace(' & Wits Appraisal','');
    btn.title=a.sub;
    btn.onclick=()=>toggleAnalysisFilter(a.key);
    afBar.appendChild(btn);
  });

  /* Landmark selector */
  rebuildLandmarkSelector();

  /* Pip bar */
  document.getElementById('landmark-bar').innerHTML=LM_DEFS.map(d=>
    `<div class="lm-pip" id="pip-${d.id}" onclick="handlePipClick('${d.id}')" title="${d.name}" style="border-color:${d.color}">${d.abbr}</div>`).join('');

  /* Landmark list */
  document.getElementById('lm-list').innerHTML=LM_DEFS.map(d=>
    `<div class="lm-item" id="lmi-${d.id}" onclick="selectLandmark('${d.id}')">
      <div class="lm-dot" style="border-color:${d.color}"></div>
      <div style="flex:1;min-width:0"><div class="lm-name">${d.abbr} — ${d.name}</div><div class="lm-desc">${d.desc}</div></div>
      <div class="lm-coord" id="lmc-${d.id}">—</div></div>`).join('');

  /* Report options */
  document.getElementById('ropt-list').innerHTML=ANALYSES.map(a=>
    `<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-card);cursor:pointer;transition:all .12s" id="ropt-${a.key}-wrap">
      <input type="checkbox" id="ropt-${a.key}" checked style="accent-color:var(--gold);width:15px;height:15px;cursor:pointer" onchange="updateReportOptStyle('${a.key}')">
      <div><div style="font-size:12px;font-weight:700;color:var(--text-bright)">${a.label}</div><div style="font-size:10px;color:var(--text-dim);margin-top:1px">${a.sub}</div></div>
    </label>`).join('');

  /* Tables */
  ANALYSES.forEach(a=>buildTable(a.key+'-table', a.data));
}

function buildTable(tid, meas){
  document.querySelector('#'+tid+' tbody').innerHTML=meas.map((m,i)=>{
    const refOnly=(m.norm===null||m.norm===undefined||m.sd===null||m.sd===undefined);
    const normText=refOnly?'ref only':m.norm+m.unit+' ±'+m.sd;
    return`<tr><td>${m.name}</td><td class="val na" id="${tid}-v${i}">—</td><td class="norm" id="${tid}-n${i}">${normText}</td><td class="dev na" id="${tid}-d${i}">—</td></tr>`;
  }).join('');
}

function updateReportOptStyle(key){
  const cb=document.getElementById('ropt-'+key), wrap=document.getElementById('ropt-'+key+'-wrap');
  if(wrap){ wrap.style.borderColor=cb.checked?'rgba(200,152,42,.35)':'var(--border)'; wrap.style.background=cb.checked?'rgba(200,152,42,.08)':'var(--bg-card)'; }
  if(cb.checked) document.getElementById('ropt-warning').style.display='none';
}

/* ── UPDATE ALL UI ── */
function updateAllUI(){ updateLandmarkUI(); updateMeasurements(); updateClassification(); updateSummary(); updateTabBadges(); if(currentUser && typeof analytics!=='undefined') analytics.logEvent('landmark_count', { count: Object.keys(landmarks).filter(id=>landmarks[id]!=null).length }); }
function updateTabBadges(){
  ANALYSES.forEach(a=>{
    const required=new Set();
    a.data.forEach(m=>m.requires.forEach(id=>required.add(id)));
    const total=required.size;
    const placed=[...required].filter(id=>has(id)).length;
    const tab=document.querySelector(`.atab[onclick="showTab('${a.key}')"]`);
    if(!tab)return;
    let badge=tab.querySelector('.tab-badge');
    if(!badge){badge=document.createElement('span');badge.className='tab-badge';tab.appendChild(badge);}
    badge.textContent=placed+'/'+total;
    let color;
    if(placed===0)color='var(--text-muted,#94a3b8)';
    else if(placed===total)color='var(--green)';
    else if(placed/total>=0.5)color='var(--amber)';
    else color='var(--red)';
    badge.style.color=color;
  });
}

function updateLandmarkUI(){
  const required=getRequiredLandmarkIds();
  let n=0, total=0;
  LM_DEFS.forEach(d=>{
    const p=has(d.id); if(p)n++;
    const a=activeLandmark===d.id;
    const sk=skippedLandmarks.has(d.id);
    const isRequired=required.has(d.id);
    if(isRequired) total++;
    const pip=document.getElementById('pip-'+d.id);
    if(pip){
      pip.style.display=isRequired?'':'none';
      pip.className='lm-pip'+(p?' placed':'')+(a?' active':'')+(sk?' skipped':'');
      pip.title=d.name+(sk?' (skipped — click to un-skip)':'');
    }
    const lmi=document.getElementById('lmi-'+d.id);
    if(lmi){
      lmi.style.display=isRequired?'':'none';
      lmi.className='lm-item'+(p?' placed':'')+(a?' active':'')+(sk?' skipped':'');
    }
    const co=document.getElementById('lmc-'+d.id);
    if(co) co.textContent=sk?'⊘ skip':p?Math.round(L(d.id).x)+', '+Math.round(L(d.id).y):'—';
  });
  const placedRequired=[...required].filter(id=>has(id)).length;
  document.getElementById('placed-count').textContent=placedRequired+' / '+total;
  document.getElementById('placed-summary').textContent=placedRequired+' of '+total+' required placed.';
}

function updateMeasurements(){
  if(currentUser && typeof analytics!=='undefined') analytics.logEvent('analysis_run', { module: document.querySelector('.atab.active')?.textContent || 'unknown' });
  ANALYSES.forEach(a=>updateTable(a.key+'-table', a.data));
}

function updateTable(tid, meas){
  meas.forEach((m,i)=>{
    const vE=document.getElementById(tid+'-v'+i), dE=document.getElementById(tid+'-d'+i), nE=document.getElementById(tid+'-n'+i);
    const {norm, sd}=getNorm(m);
    const refOnly=(norm===null||norm===undefined||sd===null||sd===undefined);
    if(nE) nE.textContent=refOnly?'ref only':norm+m.unit+' ±'+sd;
    const missingIds=m.requires.filter(id=>!has(id));
    const ok=missingIds.length===0;
    const needsCal=m.unit==='mm'&&pixelsPerMm===0&&m.name!=='LAFH Ratio'&&!m.name.includes('%');
    if(!ok){
      vE.textContent='—'; vE.className='val na';
      dE.textContent='↳ '+missingIds.join(', '); dE.className='dev needs'; return;
    }
    if(needsCal){ vE.textContent='—'; vE.className='val na'; dE.textContent='cal?'; dE.className='dev na'; return; }
    const val=m.calc(); if(isNaN(val)){ vE.textContent='—'; vE.className='val na'; dE.textContent='—'; dE.className='dev na'; return; }
    const r=Math.round(val*10)/10; vE.textContent=r+m.unit; vE.className='val';
    if(refOnly){ dE.textContent='—'; dE.className='dev na'; return; }
    const dev=r-norm, devA=Math.abs(dev);
    dE.textContent=(dev>=0?'+':'')+dev.toFixed(1);
    dE.className='dev '+(devA>sd*2?'severe':devA>sd?'mild':'good');
  });
}

/* ── CLASSIFICATION ── */
function updateClassification(){
  classify('cl-skel',['S','N','A','B'],()=>{ const anb=angleAtVertex(L('S'),L('N'),L('A'))-angleAtVertex(L('S'),L('N'),L('B')); if(anb>=-1&&anb<=3)return['Class I ('+anb.toFixed(1)+'°)','normal']; if(anb>3)return['Class II ('+anb.toFixed(1)+'°)','warn']; return['Class III ('+anb.toFixed(1)+'°)','abnormal']; });
  classify('cl-max',['S','N','A'],()=>{ const v=angleAtVertex(L('S'),L('N'),L('A')); if(v>=80&&v<=84)return['Normal ('+v.toFixed(1)+'°)','normal']; return[(v>84?'Prognathic':'Retrognathic')+' ('+v.toFixed(1)+'°)','warn']; });
  classify('cl-mand',['S','N','B'],()=>{ const v=angleAtVertex(L('S'),L('N'),L('B')); if(v>=78&&v<=82)return['Normal ('+v.toFixed(1)+'°)','normal']; return[(v>82?'Prognathic':'Retrognathic')+' ('+v.toFixed(1)+'°)','warn']; });
  classify('cl-growth',['S','N','Go','Gn'],()=>{ const v=acuteAngleBetweenLines(L('S'),L('N'),L('Go'),L('Gn')); if(v>=27&&v<=37)return['Normodivergent ('+v.toFixed(1)+'°)','normal']; if(v>37)return['Hyperdivergent ('+v.toFixed(1)+'°)','abnormal']; return['Hypodivergent ('+v.toFixed(1)+'°)','warn']; });
  classify('cl-fma',['Po','Or','Go','Me'],()=>{ const v=acuteAngleBetweenLines(L('Po'),L('Or'),L('Go'),L('Me')); if(v>=22&&v<=28)return['Mesocephalic ('+v.toFixed(1)+'°)','normal']; if(v>28)return['Dolichocephalic ('+v.toFixed(1)+'°)','abnormal']; return['Brachycephalic ('+v.toFixed(1)+'°)','warn']; });
  classify('cl-mmpa',['ANS','PNS','Go','Me'],()=>{ const v=acuteAngleBetweenLines(L('ANS'),L('PNS'),L('Go'),L('Me')); if(v>=23&&v<=31)return['Average ('+v.toFixed(1)+'°)','normal']; if(v>31)return['High MMPA ('+v.toFixed(1)+'°)','abnormal']; return['Low MMPA ('+v.toFixed(1)+'°)','warn']; });
  classify('cl-bjork',['N','S','Ar','Go','Me'],()=>{
    const sum=angleAtVertex(L('N'),L('S'),L('Ar'))+angleAtVertex(L('S'),L('Ar'),L('Go'))+angleAtVertex(L('Ar'),L('Go'),L('Me'));
    if(sum>=390&&sum<=402)return['Normodivergent ∑'+sum.toFixed(0)+'°','normal'];
    if(sum>402)return['Hyperdivergent ∑'+sum.toFixed(0)+'°','abnormal'];
    return['Hypodivergent ∑'+sum.toFixed(0)+'°','warn'];
  });
  classify('cl-conv',['N','A','Pg'],()=>{ const ang=angleAtVertex(L('N'),L('A'),L('Pg')); const conv=180-ang; const cross=(L('Pg').x-L('N').x)*(L('A').y-L('N').y)-(L('Pg').y-L('N').y)*(L('A').x-L('N').x); const s=cross<0?conv:-conv; if(Math.abs(s)<=5)return['Straight ('+s.toFixed(1)+'°)','normal']; if(s>5)return['Convex ('+s.toFixed(1)+'°)','warn']; return['Concave ('+s.toFixed(1)+'°)','abnormal']; });
}
function classify(elId, req, fn){
  const el=document.getElementById(elId);
  if(!req.every(id=>has(id))){ el.textContent='—'; el.className='class-value na'; return; }
  const[text,cls]=fn(); el.textContent=text; el.className='class-value '+cls;
}

/* ── SUMMARY ── */
function updateSummary(){
  const el=document.getElementById('summary-text'); const p=[];
  if(has('S')&&has('N')&&has('A')&&has('B')){
    const sna=angleAtVertex(L('S'),L('N'),L('A')), snb=angleAtVertex(L('S'),L('N'),L('B')), anb=sna-snb;
    let sk='I'; if(anb>3)sk='II'; else if(anb<-1)sk='III';
    p.push('Skeletal Class '+sk+' pattern (ANB '+anb.toFixed(1)+'°)');
    if(sna>84) p.push('maxillary prognathism'); else if(sna<80) p.push('maxillary retrognathism');
    if(snb>82) p.push('mandibular prognathism'); else if(snb<78) p.push('mandibular retrognathism');
  }
  if(has('S')&&has('N')&&has('Go')&&has('Gn')){
    const g=acuteAngleBetweenLines(L('S'),L('N'),L('Go'),L('Gn'));
    p.push(g>37?'hyperdivergent growth pattern':g<27?'hypodivergent growth pattern':'normodivergent growth pattern');
  }
  if(has('N')&&has('S')&&has('Ar')&&has('Go')&&has('Me')){
    const sum=angleAtVertex(L('N'),L('S'),L('Ar'))+angleAtVertex(L('S'),L('Ar'),L('Go'))+angleAtVertex(L('Ar'),L('Go'),L('Me'));
    if(sum>402) p.push('Björk sum indicates hyperdivergent tendency (∑'+sum.toFixed(0)+'°)');
    else if(sum<390) p.push('Björk sum indicates hypodivergent tendency (∑'+sum.toFixed(0)+'°)');
  }
  if(has('ANS')&&has('PNS')&&has('Go')&&has('Me')){
    const mmpa=acuteAngleBetweenLines(L('ANS'),L('PNS'),L('Go'),L('Me'));
    if(mmpa>31) p.push('increased MMPA ('+mmpa.toFixed(1)+'°)'); else if(mmpa<23) p.push('reduced MMPA ('+mmpa.toFixed(1)+'°)');
  }
  if(has('U1T')&&has('U1A')&&has('ANS')&&has('PNS')){ const u1mx=angleBetweenLines(L('U1A'),L('U1T'),L('ANS'),L('PNS')); if(u1mx>115) p.push('proclined upper incisors to maxillary plane'); else if(u1mx<103) p.push('retroclined upper incisors to maxillary plane'); }
  if(has('L1T')&&has('L1A')&&has('Go')&&has('Me')){ const l=angleBetweenLines(L('L1T'),L('L1A'),L('Go'),L('Me')); if(l>99) p.push('proclined lower incisors to mandibular plane'); else if(l<87) p.push('retroclined lower incisors to mandibular plane'); }
  if(!p.length){ el.textContent='Place S, N, A, B landmarks to see classification.'; el.style.color='var(--text-dim)'; el.style.fontStyle='italic'; }
  else{ el.textContent=p.join(', with ')+'.'; el.style.color='var(--text-bright)'; el.style.fontStyle='normal'; }
}

/* ── TABS ── */
function showTab(id){
  if(currentUser && typeof analytics!=='undefined') analytics.logEvent('tab_switched', { tab: id });
  document.querySelectorAll('.atab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.apanel').forEach(p=>p.classList.remove('active'));
  const tab=document.querySelector(`.atab[onclick="showTab('${id}')"]`); if(tab) tab.classList.add('active');
  const panel=document.getElementById('tab-'+id); if(panel) panel.classList.add('active');
}
function toggleTracing(){ showTracing=!showTracing; document.getElementById('btn-tracing').classList.toggle('active',showTracing); render(); }
function toggleLabels(){ showLabels=!showLabels; document.getElementById('btn-labels').classList.toggle('active',showLabels); render(); }
