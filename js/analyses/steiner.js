const STEINER=[
  {name:'SNA',unit:'°',norm:82,sd:2,requires:['S','N','A'],calc:()=>angleAtVertex(L('S'),L('N'),L('A'))},
  {name:'SNB',unit:'°',norm:80,sd:2,requires:['S','N','B'],calc:()=>angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'ANB',unit:'°',norm:2,sd:2,requires:['S','N','A','B'],calc:()=>angleAtVertex(L('S'),L('N'),L('A'))-angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'GoGn–SN',unit:'°',norm:32,sd:5,requires:['S','N','Go','Gn'],calc:()=>acuteAngleBetweenLines(L('S'),L('N'),L('Go'),L('Gn'))},
  {name:'U1–NA (°)',unit:'°',norm:22,sd:2,requires:['N','A','U1T','U1A'],calc:()=>acuteAngleBetweenLines(L('N'),L('A'),L('U1A'),L('U1T'))},
  {name:'U1–NA (mm)',unit:'mm',norm:4,sd:1,requires:['N','A','U1T'],calc:()=>px2mm(perpDist(L('U1T'),L('N'),L('A')))},
  {name:'L1–NB (°)',unit:'°',norm:25,sd:2,requires:['N','B','L1T','L1A'],calc:()=>acuteAngleBetweenLines(L('N'),L('B'),L('L1A'),L('L1T'))},
  {name:'L1–NB (mm)',unit:'mm',norm:4,sd:1,requires:['N','B','L1T'],calc:()=>px2mm(perpDist(L('L1T'),L('N'),L('B')))},
  {name:'Interincisal',unit:'°',norm:131,sd:6,requires:['U1T','U1A','L1T','L1A'],calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  {name:'Occ Plane to SN',unit:'°',norm:14,sd:4,requires:['S','N','Op1','Op2'],
    calc:()=>{const op=getOcclusalPlane();if(!op)return NaN;return acuteAngleBetweenLines(L('S'),L('N'),op.A,op.B);}},
];
