/* ── 3-POINT OCCLUSAL PLANE ── */
function getOcclusalPlane(){
  if(has('Op1')&&has('Op2')&&has('Op3')){
    const pts=[L('Op1'),L('Op2'),L('Op3')];
    const mx=(pts[0].x+pts[1].x+pts[2].x)/3, my=(pts[0].y+pts[1].y+pts[2].y)/3;
    const sxx=pts.reduce((s,p)=>s+(p.x-mx)**2,0);
    const syy=pts.reduce((s,p)=>s+(p.y-my)**2,0);
    const sxy=pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
    if(sxx+syy<0.001)return{A:L('Op1'),B:L('Op2')};
    const theta=0.5*Math.atan2(2*sxy,sxx-syy);
    const cos=Math.cos(theta),sin=Math.sin(theta),span=(imgW||1000);
    let A={x:mx-cos*span/2,y:my-sin*span/2}, B={x:mx+cos*span/2,y:my+sin*span/2};
    // Re-orient fitted line to match Op1→Op2 direction so sign stays consistent
    const dot=(B.x-A.x)*(L('Op2').x-L('Op1').x)+(B.y-A.y)*(L('Op2').y-L('Op1').y);
    if(dot<0){const tmp=A;A=B;B=tmp;}
    return{A,B};
  }
  if(has('Op1')&&has('Op2'))return{A:L('Op1'),B:L('Op2')};
  return null;
}

const EASTMAN=[
  {name:'SNA',unit:'°',norm:81,sd:3,requires:['S','N','A'],calc:()=>angleAtVertex(L('S'),L('N'),L('A'))},
  {name:'SNB',unit:'°',norm:79,sd:3,requires:['S','N','B'],calc:()=>angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'ANB',unit:'°',norm:3,sd:2,requires:['S','N','A','B'],calc:()=>angleAtVertex(L('S'),L('N'),L('A'))-angleAtVertex(L('S'),L('N'),L('B'))},
  {name:'SN–MaxP',unit:'°',norm:8,sd:3,requires:['S','N','ANS','PNS'],calc:()=>acuteAngleBetweenLines(L('S'),L('N'),L('ANS'),L('PNS'))},
  {name:'MMPA',unit:'°',norm:27,sd:4,requires:['ANS','PNS','Go','Me'],calc:()=>acuteAngleBetweenLines(L('ANS'),L('PNS'),L('Go'),L('Me'))},
  {name:'U1–MaxP',unit:'°',norm:109,sd:6,requires:['U1T','U1A','ANS','PNS'],calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('ANS'),L('PNS'))},
  {name:'L1–MandP',unit:'°',norm:93,sd:6,requires:['L1T','L1A','Go','Me'],calc:()=>angleBetweenLines(L('L1T'),L('L1A'),L('Go'),L('Me'))},
  {name:'Interincisal',unit:'°',norm:135,sd:10,requires:['U1T','U1A','L1T','L1A'],calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  {name:'U1–NA (mm)',unit:'mm',norm:4,sd:2,requires:['N','A','U1T'],calc:()=>px2mm(perpDist(L('U1T'),L('N'),L('A')))},
  {name:'L1–NB (mm)',unit:'mm',norm:4,sd:2,requires:['N','B','L1T'],calc:()=>px2mm(perpDist(L('L1T'),L('N'),L('B')))},
  {name:'LAFH Ratio',unit:'%',norm:55,sd:2,requires:['N','ANS','Me'],calc:()=>{const t=dist(L('N'),L('Me'));const lo=dist(L('ANS'),L('Me'));if(t===0)return NaN;return(lo/t)*100;}},
  {name:'Upper AFH (N–ANS)',unit:'mm',norm:54,sd:3,requires:['N','ANS'],
    calc:()=>px2mm(Math.hypot(L('N').x-L('ANS').x,L('N').y-L('ANS').y))},
  {name:'Lower AFH (ANS–Me)',unit:'mm',norm:65,sd:5,requires:['ANS','Me'],
    calc:()=>px2mm(Math.hypot(L('ANS').x-L('Me').x,L('ANS').y-L('Me').y))},
  {name:'L1 to A-Pog (mm)',unit:'mm',norm:1,sd:1,requires:['A','Pg','L1T'],
    calc:()=>px2mm(signedPerpDist(L('L1T'),L('A'),L('Pg')))},
  {name:'Nasolabial Angle',unit:'°',norm:102,sd:8,requires:['Cm','Sn','Ls'],
    calc:()=>angleAtVertex(L('Cm'),L('Sn'),L('Ls'))},
  {name:'Lower Lip to E-Plane',unit:'mm',norm:-2,sd:1,requires:['Prn','sPg','Li'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;const cross=(L('Li').x-L('Prn').x)*dy-(L('Li').y-L('Prn').y)*dx;return px2mm(cross/len);}},
];
