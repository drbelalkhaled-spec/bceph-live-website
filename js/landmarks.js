if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    if(typeof r==='number')r=[r,r,r,r];
    this.moveTo(x+r[0],y);this.lineTo(x+w-r[1],y);this.quadraticCurveTo(x+w,y,x+w,y+r[1]);
    this.lineTo(x+w,y+h-r[2]);this.quadraticCurveTo(x+w,y+h,x+w-r[2],y+h);
    this.lineTo(x+r[3],y+h);this.quadraticCurveTo(x,y+h,x,y+h-r[3]);
    this.lineTo(x,y+r[0]);this.quadraticCurveTo(x,y,x+r[0],y);this.closePath();return this;
  };
}

/* ── LANDMARK DEFINITIONS (30 total) ── */
const LM_DEFS = [
  { id:'S',   name:'Sella (S)',             abbr:'S',    desc:'Centre of the sella turcica (pituitary fossa)',                                            color:'#ef4444' },
  { id:'N',   name:'Nasion (N)',            abbr:'N',    desc:'Most anterior point of frontonasal suture at the nasofrontal junction',                    color:'#f97316' },
  { id:'Or',  name:'Orbitale (Or)',         abbr:'Or',   desc:'Lowest point on the inferior margin of the bony orbit',                                   color:'#eab308' },
  { id:'Po',  name:'Porion (Po)',           abbr:'Po',   desc:'Most superior point of the external auditory meatus (bony)',                              color:'#84cc16' },
  { id:'Ar',  name:'Articulare (Ar)',       abbr:'Ar',   desc:'Intersection of the posterior condyle outline with the cranial base — needed for Björk',  color:'#10b981' },
  { id:'Ba',  name:'Basion (Ba)',           abbr:'Ba',   desc:'Most inferior-posterior point of the clivus at foramen magnum — Ricketts facial axis',     color:'#f0abfc' },
  { id:'Dc',  name:'Condyle Center (Dc)',   abbr:'Dc',   desc:'Centre of the condylar head on the Frankfort plane — Ricketts condylar position',          color:'#93c5fd' },
  { id:'CF',  name:'Center of Face (CF)',   abbr:'CF',   desc:'Intersection of Frankfort Horizontal with perpendicular through Pt — Ricketts center of face', color:'#c4b5fd' },
  { id:'A',   name:'Point A',              abbr:'A',    desc:'Deepest point on the anterior surface of the maxilla (subspinale)',                        color:'#22c55e' },
  { id:'B',   name:'Point B',              abbr:'B',    desc:'Deepest point on the anterior mandibular symphysis (supramentale)',                         color:'#14b8a6' },
  { id:'ANS', name:'ANS',                  abbr:'ANS',  desc:'Tip of the anterior nasal spine — forward projection of maxilla',                          color:'#06b6d4' },
  { id:'PNS', name:'PNS',                  abbr:'PNS',  desc:'Tip of the posterior nasal spine — posterior limit of palatal plane',                      color:'#0ea5e9' },
  { id:'Pt',  name:'Pterygoid (Pt)',        abbr:'Pt',   desc:'Most posterior-superior point of the pterygomaxillary fissure — needed for Ricketts',      color:'#67e8f9' },
  { id:'Go',  name:'Gonion (Go)',           abbr:'Go',   desc:'Most posterior-inferior point of the gonial angle — bisect angle of ramus and body',       color:'#3b82f6' },
  { id:'Me',  name:'Menton (Me)',           abbr:'Me',   desc:'Lowest point on the mandibular symphysis outline',                                         color:'#6366f1' },
  { id:'Gn',  name:'Gnathion (Gn)',         abbr:'Gn',   desc:'Most anterior-inferior point on the chin — midway between Pg and Me',                     color:'#8b5cf6' },
  { id:'Pg',  name:'Pogonion (Pg)',         abbr:'Pg',   desc:'Most anterior point of the bony chin on the mandibular symphysis',                         color:'#a855f7' },
  { id:'U1T', name:'U1 Tip',               abbr:'U1T',  desc:'Incisal (cutting) edge of the upper central incisor',                                      color:'#d946ef' },
  { id:'U1A', name:'U1 Apex',              abbr:'U1A',  desc:'Root apex of the upper central incisor',                                                    color:'#ec4899' },
  { id:'L1T', name:'L1 Tip',               abbr:'L1T',  desc:'Incisal (cutting) edge of the lower central incisor',                                      color:'#f43f5e' },
  { id:'L1A', name:'L1 Apex',              abbr:'L1A',  desc:'Root apex of the lower central incisor',                                                    color:'#fb7185' },
  { id:'Prn', name:'Pronasale (Prn)',       abbr:'Prn',  desc:'Most prominent point of the soft tissue nose tip',                                          color:'#fb923c' },
  { id:'Cm',  name:'Columella (Cm)',        abbr:'Cm',   desc:'Most anterior point of the columella of the nose, at the base where the columella meets the upper lip', color:'#f59e0b' },
  { id:'Sn',  name:'Subnasale (Sn)',        abbr:'Sn',   desc:'Junction of the nasal columella and upper lip in the midsagittal plane — new in v2',       color:'#fcd34d' },
  { id:'Ls',  name:'Labiale Sup (Ls)',      abbr:'Ls',   desc:'Most anterior point of the upper lip vermilion border',                                     color:'#facc15' },
  { id:'Li',  name:'Labiale Inf (Li)',      abbr:'Li',   desc:'Most anterior point of the lower lip vermilion border',                                     color:'#a3e635' },
  { id:'sPg', name:'ST Pogonion (sPg)',     abbr:'sPg',  desc:'Most anterior point of the soft tissue chin',                                               color:'#34d399' },
  { id:'MeP', name:"ST Menton (Me')",       abbr:"Me'",  desc:"Most inferior point of the soft tissue chin — soft tissue counterpart of Me — new in v2",  color:'#6ee7b7' },
  { id:'Op1', name:'Occlusal Pt 1 (Op1)',  abbr:'Op1',  desc:'Occlusal plane reference — most posterior distal cusp contact (molar)',                    color:'#38bdf8' },
  { id:'Op2', name:'Occlusal Pt 2 (Op2)',  abbr:'Op2',  desc:'Occlusal plane reference — anterior incisal contact point',                                 color:'#818cf8' },
  { id:'Op3', name:'Occlusal Pt 3 (Op3)',  abbr:'Op3',  desc:'Third occlusal plane point — premolar contact — enables 3-point best-fit plane — new in v2', color:'#7dd3fc' },
  { id:'Co',  name:'Condylion (Co)',        abbr:'Co',   desc:'Most superior-posterior point of mandibular condyle — McNamara Co-A/Co-Gn',                  color:'#fb923c' },
  { id:'U6',  name:'Upper Molar (U6)',      abbr:'U6',   desc:'Upper first molar distal cusp tip — Ricketts upper molar to PtV',                             color:'#f97316' },
];
const LM_IDS = LM_DEFS.map(d => d.id);

/* ── SKIP SET ── */
function skipCurrentLandmark(){
  if(!activeLandmark)return;
  if(skippedLandmarks.has(activeLandmark)){
    skippedLandmarks.delete(activeLandmark); toast('Un-skipped: '+activeLandmark,'↩');
    updateLandmarkUI(); render(); return;
  }
  if(has(activeLandmark)){toast('Already placed — remove first to skip','⚠️');return;}
  skippedLandmarks.add(activeLandmark);
  toast('Skipped: '+activeLandmark+' — click pip dot again to un-skip','⊘');
  advanceToNext(); updateLandmarkUI(); render();
}
function handlePipClick(id){
  if(skippedLandmarks.has(id)){
    skippedLandmarks.delete(id); selectLandmark(id); toast('Un-skipped: '+id,'↩');
    updateLandmarkUI(); render();
  } else { selectLandmark(id); }
}
