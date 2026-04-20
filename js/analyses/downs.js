const DOWNS=[
  {name:'Facial Angle',unit:'°',norm:87.8,sd:3.6,requires:['N','Pg','Po','Or'],calc:()=>angleBetweenLines(L('N'),L('Pg'),L('Po'),L('Or'))},
  {name:'Convexity',unit:'°',norm:0,sd:5.1,requires:['N','A','Pg'],calc:()=>{
    const ang=angleAtVertex(L('N'),L('A'),L('Pg'));const conv=180-ang;
    const cross=(L('Pg').x-L('N').x)*(L('A').y-L('N').y)-(L('Pg').y-L('N').y)*(L('A').x-L('N').x);
    return cross<0?conv:-conv;
  }},
  {name:'A–B Plane',unit:'°',norm:-4.6,sd:4.6,requires:['A','B','N','Pg'],calc:()=>{
    const ang=acuteAngleBetweenLines(L('A'),L('B'),L('N'),L('Pg'));
    const cross=(L('B').x-L('A').x)*(L('Pg').y-L('N').y)-(L('B').y-L('A').y)*(L('Pg').x-L('N').x);
    return cross>0?-ang:ang;
  }},
  {name:'Mand Plane (FH)',unit:'°',norm:21.9,sd:3.2,requires:['Go','Me','Po','Or'],calc:()=>acuteAngleBetweenLines(L('Go'),L('Me'),L('Po'),L('Or'))},
  {name:'Y-Axis',unit:'°',norm:59.4,sd:3.8,requires:['S','Gn','Po','Or'],calc:()=>angleBetweenLines(L('S'),L('Gn'),L('Po'),L('Or'))},
  {name:'Interincisal Angle',unit:'°',norm:130,sd:5.8,requires:['U1T','U1A','L1T','L1A'],
    calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  {name:'Incisor Occ Plane Angle',unit:'°',norm:14.5,sd:3.5,requires:['L1T','L1A','Op1','Op2'],
    calc:()=>{const op=getOcclusalPlane();if(!op)return NaN;return 90-acuteAngleBetweenLines(L('L1A'),L('L1T'),op.A,op.B);}},
  {name:'Incisor Mand Plane Angle',unit:'°',norm:1.4,sd:3.8,requires:['L1T','L1A','Go','Me'],
    calc:()=>90-acuteAngleBetweenLines(L('L1A'),L('L1T'),L('Go'),L('Me'))},
  {name:'U1 to A-Pog (mm)',unit:'mm',norm:2.7,sd:1.8,requires:['A','Pg','U1T'],
    calc:()=>px2mm(perpDist(L('U1T'),L('A'),L('Pg')))},
  {name:'Cant of Occ Plane',unit:'°',norm:9.3,sd:3.8,requires:['Op1','Op2','Po','Or'],
    calc:()=>{const op=getOcclusalPlane();if(!op)return NaN;return acuteAngleBetweenLines(op.A,op.B,L('Po'),L('Or'));}},
];
