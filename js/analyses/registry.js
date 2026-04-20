/* Report analysis registry */
const ANALYSES = [
  {key:'eastman',  label:'Eastman Analysis',        sub:'SNA, SNB, ANB, MMPA, incisors, LAFH',            data:EASTMAN},
  {key:'wits',     label:'Wits Appraisal',           sub:'AO–BO sagittal jaw discrepancy on occlusal plane — requires Op1, Op2, A, B + calibration', data:WITS},
  {key:'steiner',  label:'Steiner Analysis',         sub:'SNA, SNB, ANB, GoGn–SN, incisors',               data:STEINER},
  {key:'downs',    label:'Downs Analysis',            sub:'Facial angle, convexity, A–B plane, Y-axis',     data:DOWNS},
  {key:'tweed',    label:'Tweed Triangle',            sub:'FMA, FMIA, IMPA',                                data:TWEED},
  {key:'mcnamara', label:'McNamara Analysis',         sub:'Facial heights, A to N-Perp, Pg to N-Perp',     data:MCNAMARA},
  {key:'bjork',    label:'Björk-Jarabak Analysis',   sub:'Saddle, articular, gonial angles, PFH/AFH',      data:BJORK},
  {key:'ricketts', label:'Ricketts Analysis',         sub:'Facial axis, depth, convexity, A-Po distances',  data:RICKETTS},
  {key:'holdaway', label:'Holdaway Soft Tissue',      sub:'H-angle, nose, lip, ST convexity — needs Sn, Me\'', data:HOLDAWAY},
  {key:'eline',    label:'E-Line Analysis',           sub:'Lip positions to E-line (Prn–sPg), nasolabial angle',  data:ELINE},
  {key:'kim',      label:"Kim's Analysis",            sub:'ODI, APDI, Combination Factor, Extraction Index — requires calibration for EI', data:KIM},
];
