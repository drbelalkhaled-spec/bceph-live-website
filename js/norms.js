/* ── NORM SETS ── */
const NORM_SETS = {
  adult:      { label:'Adult Mixed',      ov:{} },
  adult_m:    { label:'Adult Male',       ov:{
    'SNA':{norm:82,sd:3},'SNB':{norm:80,sd:3},'ANB':{norm:2,sd:2},'GoGn–SN':{norm:32,sd:5},
    'FMA':{norm:23,sd:3},'MMPA':{norm:26,sd:4},'FMIA':{norm:67,sd:3},'IMPA':{norm:90,sd:3},
    'Post Face Ht (S-Go)':{norm:81,sd:6},'Ant Face Ht (N-Me)':{norm:122,sd:7},'PFH/AFH Ratio':{norm:64,sd:3},
    'Convexity A to N-Pg':{norm:1,sd:2},
    'Wits Appraisal (AO–BO)':{norm:-1,sd:2},
  }},
  adult_f:    { label:'Adult Female',     ov:{
    'SNA':{norm:80,sd:3},'SNB':{norm:78,sd:3},'ANB':{norm:2,sd:2},'GoGn–SN':{norm:34,sd:5},
    'FMA':{norm:26,sd:3},'MMPA':{norm:28,sd:4},'FMIA':{norm:63,sd:3},'IMPA':{norm:91,sd:3},
    'Post Face Ht (S-Go)':{norm:74,sd:6},'Ant Face Ht (N-Me)':{norm:113,sd:7},'PFH/AFH Ratio':{norm:62,sd:3},
    'Convexity A to N-Pg':{norm:2,sd:2},
    'Wits Appraisal (AO–BO)':{norm:0,sd:2},
  }},
  child_8:    { label:'Child 8–10y',      ov:{
    'SNA':{norm:80,sd:4},'SNB':{norm:76,sd:4},'ANB':{norm:4,sd:2},
    'MMPA':{norm:28,sd:5},'FMA':{norm:27,sd:4},'GoGn–SN':{norm:35,sd:5},
    'Post Face Ht (S-Go)':{norm:62,sd:5},'Ant Face Ht (N-Me)':{norm:102,sd:6},'PFH/AFH Ratio':{norm:61,sd:3},
    'Saddle Angle (N-S-Ar)':{norm:123,sd:6},'Sum of Angles':{norm:398,sd:7},
  }},
  adolescent: { label:'Adolescent 12–15y', ov:{
    'SNA':{norm:81,sd:3},'SNB':{norm:78,sd:3},'ANB':{norm:3,sd:2},
    'MMPA':{norm:27,sd:4},'FMA':{norm:25,sd:3},'GoGn–SN':{norm:33,sd:5},
    'Post Face Ht (S-Go)':{norm:70,sd:5},'Ant Face Ht (N-Me)':{norm:110,sd:7},
  }},
};
let activeNormSet = 'adult';
function setNormSet(key){ activeNormSet=key; updateMeasurements(); }
function getNorm(m){ return NORM_SETS[activeNormSet]?.ov?.[m.name] || {norm:m.norm, sd:m.sd}; }
