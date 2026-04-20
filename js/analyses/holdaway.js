/* ── HOLDAWAY SOFT TISSUE (v2) ── */
const HOLDAWAY=[
  {name:'H-Angle (H-line to NB)',unit:'°',norm:8,sd:2,requires:['N','B','Ls','sPg'],
    calc:()=>acuteAngleBetweenLines(L('N'),L('B'),L('sPg'),L('Ls'))},
  {name:'Nose Prominence to H-Line',unit:'mm',norm:9,sd:2,requires:['Prn','Ls','sPg'],
    calc:()=>{const dx=L('sPg').x-L('Ls').x,dy=L('sPg').y-L('Ls').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;return px2mm(Math.abs((L('Prn').x-L('Ls').x)*dy-(L('Prn').y-L('Ls').y)*dx)/len);}},
  {name:'Lower Lip to H-Line',unit:'mm',norm:0,sd:2,requires:['Li','Ls','sPg'],
    calc:()=>{const dx=L('sPg').x-L('Ls').x,dy=L('sPg').y-L('Ls').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;return px2mm(Math.abs((L('Li').x-L('Ls').x)*dy-(L('Li').y-L('Ls').y)*dx)/len);}},
  {name:'Soft Tissue Convexity (Prn–Sn–sPg)',unit:'°',norm:168,sd:4,requires:['Prn','Sn','sPg'],
    calc:()=>angleAtVertex(L('Prn'),L('Sn'),L('sPg'))},
  {name:'ST Facial Angle (FH–N–sPg)',unit:'°',norm:91,sd:3,requires:['Po','Or','N','sPg'],
    calc:()=>angleBetweenLines(L('Po'),L('Or'),L('N'),L('sPg'))},
  {name:'UL Protrusion (Ls–A, FH proj)',unit:'mm',norm:14,sd:2,requires:['A','Ls','Po','Or'],
    calc:()=>{const fhx=L('Or').x-L('Po').x,fhy=L('Or').y-L('Po').y,fl=Math.sqrt(fhx*fhx+fhy*fhy);if(fl===0)return NaN;return px2mm(((L('Ls').x-L('A').x)*fhx+(L('Ls').y-L('A').y)*fhy)/fl);}},
  {name:"Mentolabial Sulcus Depth (Me')",unit:'mm',norm:4,sd:2,requires:['Li','sPg','MeP'],
    calc:()=>{const dx=L('sPg').x-L('Li').x,dy=L('sPg').y-L('Li').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;return px2mm(Math.abs((L('MeP').x-L('Li').x)*dy-(L('MeP').y-L('Li').y)*dx)/len);}},
  {name:'Nasolabial Angle (Prn–Sn–Ls)',unit:'°',norm:102,sd:8,requires:['Prn','Sn','Ls'],
    calc:()=>angleAtVertex(L('Prn'),L('Sn'),L('Ls'))},
];
