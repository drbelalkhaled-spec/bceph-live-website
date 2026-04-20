const ELINE=[
  {name:'Upper Lip to E-Line',unit:'mm',norm:-2,sd:2,requires:['Prn','Ls','sPg'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;return px2mm(((L('Ls').x-L('Prn').x)*dy-(L('Ls').y-L('Prn').y)*dx)/len);}},
  {name:'Lower Lip to E-Line',unit:'mm',norm:0,sd:2,requires:['Prn','Li','sPg'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;return px2mm(((L('Li').x-L('Prn').x)*dy-(L('Li').y-L('Prn').y)*dx)/len);}},
  {name:'Nasolabial Angle (Prn–Sn–Ls)',unit:'°',norm:102,sd:8,requires:['Prn','Sn','Ls'],calc:()=>angleAtVertex(L('Prn'),L('Sn'),L('Ls'))},
];
