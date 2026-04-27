const MCNAMARA=[
  {name:'Upper Face Ht (N–ANS)',unit:'mm',norm:54,sd:3,requires:['N','ANS'],calc:()=>px2mm(dist(L('N'),L('ANS')))},
  {name:'Lower Face Ht (ANS–Me)',unit:'mm',norm:68,sd:4,requires:['ANS','Me'],calc:()=>px2mm(dist(L('ANS'),L('Me')))},
  {name:'A to N-Perp',unit:'mm',norm:1,sd:2,requires:['A','N','Po','Or'],calc:()=>{
    const fhx=L('Or').x-L('Po').x, fhy=L('Or').y-L('Po').y, fhLen=Math.sqrt(fhx*fhx+fhy*fhy);
    if(fhLen===0)return NaN;
    return px2mm(((L('A').x-L('N').x)*fhx+(L('A').y-L('N').y)*fhy)/fhLen);
  }},
  {name:'Pg to N-Perp',unit:'mm',norm:-2,sd:4,requires:['Pg','N','Po','Or'],calc:()=>{
    const fhx=L('Or').x-L('Po').x, fhy=L('Or').y-L('Po').y, fhLen=Math.sqrt(fhx*fhx+fhy*fhy);
    if(fhLen===0)return NaN;
    return px2mm(((L('Pg').x-L('N').x)*fhx+(L('Pg').y-L('N').y)*fhy)/fhLen);
  }},
  {name:'Eff. Length Maxilla (Co–A)',unit:'mm',norm:99.8,sd:6,requires:['Co','A'],
    calc:()=>px2mm(Math.hypot(L('Co').x-L('A').x,L('Co').y-L('A').y))},
  {name:'Eff. Length Mandible (Co–Gn)',unit:'mm',norm:134.3,sd:6.8,requires:['Co','Gn'],
    calc:()=>px2mm(Math.hypot(L('Co').x-L('Gn').x,L('Co').y-L('Gn').y))},
  {name:'Maxillomand. Differential',unit:'mm',norm:34.5,sd:4,requires:['Co','A','Gn'],
    calc:()=>{const coA=px2mm(Math.hypot(L('Co').x-L('A').x,L('Co').y-L('A').y));const coGn=px2mm(Math.hypot(L('Co').x-L('Gn').x,L('Co').y-L('Gn').y));return coGn-coA;}},
  {name:'Mand Plane Angle (McNamara)',unit:'°',norm:21.3,sd:3.9,requires:['Po','Or','Go','Me'],
    calc:()=>acuteAngleBetweenLines(L('Po'),L('Or'),L('Go'),L('Me'))},
  {name:'Facial Axis Angle',unit:'°',norm:90,sd:3.5,requires:['Ba','N','Pt','Gn'],
    calc:()=>angleBetweenLines(L('N'),L('Ba'),L('Pt'),L('Gn'))},
  {name:'U1 to A Vertical',unit:'mm',norm:5.3,sd:2,requires:['A','Po','Or','U1T'],
    calc:()=>{const fhx=L('Or').x-L('Po').x,fhy=L('Or').y-L('Po').y,len=Math.sqrt(fhx*fhx+fhy*fhy);if(len===0)return NaN;return px2mm(((L('U1T').x-L('A').x)*fhx+(L('U1T').y-L('A').y)*fhy)/len);}},
  {name:'SNA (McNamara)',unit:'°',norm:83.9,sd:3.2,requires:['S','N','A'],
    calc:()=>angleAtVertex(L('S'),L('N'),L('A'))},
  {name:'L1 to A-Pog (McNamara)',unit:'mm',norm:2.3,sd:2.1,requires:['A','Pg','L1T'],
    calc:()=>px2mm(signedPerpDist(L('L1T'),L('A'),L('Pg')))},
];
