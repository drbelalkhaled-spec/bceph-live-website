/* ── RICKETTS ── */
const RICKETTS=[
  {name:'Facial Axis (Ba-N to Pt-Gn)',unit:'°',norm:90,sd:3.5,requires:['Ba','N','Pt','Gn'],
    calc:()=>angleBetweenLines(L('N'),L('Ba'),L('Pt'),L('Gn'))},
  {name:'Facial Depth (FH to N-Pg)',unit:'°',norm:87,sd:3,requires:['Po','Or','N','Pg'],
    calc:()=>angleBetweenLines(L('Po'),L('Or'),L('N'),L('Pg'))},
  {name:'Mandibular Plane to FH',unit:'°',norm:26,sd:4,requires:['Go','Me','Po','Or'],
    calc:()=>acuteAngleBetweenLines(L('Go'),L('Me'),L('Po'),L('Or'))},
  {name:'Lower Face Ht % (ANS-Me/N-Me)',unit:'%',norm:55,sd:2,requires:['N','ANS','Me'],
    calc:()=>{const t=dist(L('N'),L('Me')),lo=dist(L('ANS'),L('Me'));if(t===0)return NaN;return(lo/t)*100;}},
  {name:'Convexity A to N-Pg',unit:'mm',norm:2,sd:2,requires:['N','A','Pg'],
    calc:()=>{
      const dx=L('Pg').x-L('N').x, dy=L('Pg').y-L('N').y, len=Math.sqrt(dx*dx+dy*dy);
      if(len===0)return NaN;
      const cross=(L('A').x-L('N').x)*dy-(L('A').y-L('N').y)*dx;
      return px2mm(cross/len);
    }},
  {name:'U1 to A-Po (mm)',unit:'mm',norm:3.5,sd:2.3,requires:['A','Pg','U1T'],
    calc:()=>px2mm(perpDist(L('U1T'),L('A'),L('Pg')))},
  {name:'L1 to A-Po (mm)',unit:'mm',norm:1,sd:2.3,requires:['A','Pg','L1T'],
    calc:()=>px2mm(signedPerpDist(L('L1T'),L('A'),L('Pg')))},
  {name:'L1 to A-Po (°)',unit:'°',norm:22,sd:4,requires:['A','Pg','L1T','L1A'],
    calc:()=>acuteAngleBetweenLines(L('A'),L('Pg'),L('L1A'),L('L1T'))},
  {name:'U1 to FH (°)',unit:'°',norm:111,sd:6,requires:['Po','Or','U1T','U1A'],
    calc:()=>angleBetweenLines(L('Po'),L('Or'),L('U1T'),L('U1A'))},
  {name:'Interincisal (U1–L1)',unit:'°',norm:130,sd:10,requires:['U1T','U1A','L1T','L1A'],
    calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  {name:'Facial Taper',unit:'°',norm:68,sd:3,requires:['N','Gn','Go'],
    calc:()=>angleAtVertex(L('N'),L('Gn'),L('Go'))},
  {name:'Palatal Plane Angle',unit:'°',norm:0,sd:5,requires:['ANS','PNS','Po','Or'],
    calc:()=>{const a=acuteAngleBetweenLines(L('ANS'),L('PNS'),L('Po'),L('Or'));const fhx=L('Or').x-L('Po').x,fhy=L('Or').y-L('Po').y;const palx=L('PNS').x-L('ANS').x,paly=L('PNS').y-L('ANS').y;const cross=fhx*paly-fhy*palx;return cross>0?a:-a;}},
  {name:'Denture Height (LAFH)',unit:'mm',norm:47,sd:4,requires:['ANS','Me'],
    calc:()=>px2mm(Math.hypot(L('ANS').x-L('Me').x,L('ANS').y-L('Me').y))},
  {name:'Upper Molar to PtV',unit:'mm',norm:21.1,sd:3,requires:['Pt','Po','Or','U6'],
    calc:()=>{const fhx=L('Or').x-L('Po').x,fhy=L('Or').y-L('Po').y,len=Math.sqrt(fhx*fhx+fhy*fhy);if(len===0)return NaN;return px2mm(((L('U6').x-L('Pt').x)*fhx+(L('U6').y-L('Pt').y)*fhy)/len);}},
  {name:'Lower Lip to E-Plane',unit:'mm',norm:-2,sd:2,requires:['Prn','sPg','Li'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;const cross=(L('Li').x-L('Prn').x)*dy-(L('Li').y-L('Prn').y)*dx;return px2mm(cross/len);}},
];
