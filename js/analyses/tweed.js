const TWEED=[
  {name:'FMA',unit:'°',norm:25,sd:3,requires:['Po','Or','Go','Me'],calc:()=>acuteAngleBetweenLines(L('Po'),L('Or'),L('Go'),L('Me'))},
  {name:'FMIA',unit:'°',norm:65,sd:3,requires:['Po','Or','L1T','L1A'],calc:()=>acuteAngleBetweenLines(L('Po'),L('Or'),L('L1A'),L('L1T'))},
  {name:'IMPA',unit:'°',norm:90,sd:3,requires:['Po','Or','Go','Me','L1T','L1A'],calc:()=>180-acuteAngleBetweenLines(L('Po'),L('Or'),L('Go'),L('Me'))-acuteAngleBetweenLines(L('Po'),L('Or'),L('L1A'),L('L1T'))},
];
