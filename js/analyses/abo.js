/* ── ABO (American Board of Orthodontics) Analysis ──
   8-measurement set: 4 skeletal, 3 dental, 1 soft tissue.
   Formulas reuse existing helpers; values for SNA/SNB/ANB/Interincisal/IMPA
   match Steiner & Tweed exactly when the same landmarks are placed. */
const ABO=[
  // ── Skeletal (4) ──
  {name:'SNA',unit:'°',norm:82,sd:2,requires:['S','N','A'],
    calc:()=>angleAtVertex(L('S'),L('N'),L('A'))},
  {name:'SNB',unit:'°',norm:80,sd:2,requires:['S','N','B'],
    calc:()=>angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'ANB',unit:'°',norm:2,sd:2,requires:['S','N','A','B'],
    calc:()=>angleAtVertex(L('S'),L('N'),L('A'))-angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'SN-MP',unit:'°',norm:32,sd:5,requires:['S','N','Go','Me'],
    calc:()=>acuteAngleBetweenLines(L('S'),L('N'),L('Go'),L('Me'))},
  // ── Dental (3) ──
  // U1 to SN: clinical convention is the OBTUSE angle (typ. 95°–115°) measured
  // posteriorly from the U1 long axis to the SN line. acuteAngleBetweenLines
  // would force the result into [0°,90°] (returning the supplementary acute
  // ~72°). Use signed-dot angleBetweenLines with U1 endpoints reversed so v2
  // runs tip→apex (up-and-back), opposite-facing v1 (S→N forward) → obtuse.
  {name:'U1 to SN',unit:'°',norm:102,sd:2,requires:['S','N','U1A','U1T'],
    calc:()=>angleBetweenLines(L('S'),L('N'),L('U1T'),L('U1A'))},
  // IMPA: angle between L1 long axis and mandibular plane, measured on the
  // lingual side. Norm 90°±5°: proclined incisors → >90°, retroclined → <90°.
  // acuteAngleBetweenLines clamps to [0°,90°], silently returning the
  // supplementary value for proclined patients (e.g. true 100° → reported 80°).
  // Use signed-dot angleBetweenLines with L1 endpoints reversed so v2 runs
  // tip→apex (back-down), opposing v1 (Go→Me forward-down) for proclined L1
  // → naturally obtuse. Matches Tweed's IMPA exactly for proclined cases.
  {name:'IMPA',unit:'°',norm:90,sd:5,requires:['Go','Me','L1A','L1T'],
    calc:()=>angleBetweenLines(L('Go'),L('Me'),L('L1T'),L('L1A'))},
  {name:'Interincisal',unit:'°',norm:130,sd:6,requires:['U1A','U1T','L1A','L1T'],
    calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  // ── Soft Tissue & Aesthetics (1) ──
  // Sign convention follows BCeph's existing E-line cross-product
  // (see eline.js / bjork.js): negative = lip posterior to E-line,
  // positive = anterior. Renamed "(ABO)" so it doesn't visually duplicate
  // Björk-Jarabak's identically-computed "Lower Lip to E-Plane" row.
  {name:'Lower Lip to E-Plane (ABO)',unit:'mm',norm:-2,sd:2,requires:['Prn','sPg','Li'],
    calc:()=>{
      const dx=L('sPg').x-L('Prn').x, dy=L('sPg').y-L('Prn').y;
      const len=Math.sqrt(dx*dx+dy*dy);
      if(len===0) return NaN;
      const cross=(L('Li').x-L('Prn').x)*dy - (L('Li').y-L('Prn').y)*dx;
      return px2mm(cross/len);
    }},
];
