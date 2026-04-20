/* ── KIM'S ANALYSIS ── */
// ODI: AB-to-MandPlane + signed(PalPlane-to-FH)
// APDI: FacialAngle + AB-to-NPg + signed(PalPlane-to-FH)
// Sign convention (Kim 1978): palatal plane tipped anteriorly downward (ANS lower than PNS) → positive contribution.
// In canvas coords (y↓): ANS.y > PNS.y means anteriorly downward → positive.
function kimSignedPalFH(){
  // Signed angle of palatal plane to FH.
  // Positive when ANS is inferior to PNS (anterior tilt, normal orientation).
  const ang=acuteAngleBetweenLines(L('ANS'),L('PNS'),L('Po'),L('Or'));
  return (L('ANS').y > L('PNS').y) ? ang : -ang;
}
function kimLipToEline(lipPt){
  // Perpendicular signed distance from lip to E-line (Prn–sPg).
  // Positive = lip BEHIND E-line (retruded, favorable for EI).
  // In canvas (y↓): E-line from Prn→sPg; lip behind = posterior = we negate the signed perp.
  const dx=L('sPg').x-L('Prn').x, dy=L('sPg').y-L('Prn').y, len=Math.sqrt(dx*dx+dy*dy);
  if(len===0) return NaN;
  // signed: positive when lip is on the "posterior" side of E-line
  const raw=((L(lipPt).x-L('Prn').x)*dy-(L(lipPt).y-L('Prn').y)*dx)/len;
  return px2mm(-raw); // negate: anterior to line → negative (protruded)
}
const KIM=[
  {name:'ODI',unit:'°',norm:74.5,sd:6.07,requires:['A','B','Go','Me','ANS','PNS','Po','Or'],calc:()=>{
    // AB plane to mandibular plane angle (always acute)
    const abMand=acuteAngleBetweenLines(L('A'),L('B'),L('Go'),L('Me'));
    return abMand + kimSignedPalFH();
  }},
  {name:'APDI',unit:'°',norm:81.4,sd:5.14,requires:['N','Pg','Po','Or','A','B','ANS','PNS'],calc:()=>{
    // Facial angle: angle of N-Pg line to FH (measured at FH, same as Downs Facial Angle)
    const facialAng=angleBetweenLines(L('N'),L('Pg'),L('Po'),L('Or'));
    // AB to N-Pg (facial plane): signed — B anterior to NPg → positive (Class III)
    const dx=L('Pg').x-L('N').x, dy=L('Pg').y-L('N').y, len=Math.sqrt(dx*dx+dy*dy);
    if(len===0) return NaN;
    const cross=dx*(L('B').y-L('N').y)-dy*(L('B').x-L('N').x);
    const abNpg=acuteAngleBetweenLines(L('A'),L('B'),L('N'),L('Pg'));
    const abNpgSigned=cross<0?abNpg:-abNpg; // positive when B is anterior to NPg
    return facialAng + abNpgSigned + kimSignedPalFH();
  }},
  {name:'CF (ODI+APDI)',unit:'°',norm:155.9,sd:5.51,requires:['A','B','Go','Me','ANS','PNS','Po','Or','N','Pg'],calc:()=>{
    const abMand=acuteAngleBetweenLines(L('A'),L('B'),L('Go'),L('Me'));
    const palFH=kimSignedPalFH();
    const facialAng=angleBetweenLines(L('N'),L('Pg'),L('Po'),L('Or'));
    const dx=L('Pg').x-L('N').x, dy=L('Pg').y-L('N').y, len=Math.sqrt(dx*dx+dy*dy);
    if(len===0) return NaN;
    const cross=dx*(L('B').y-L('N').y)-dy*(L('B').x-L('N').x);
    const abNpg=acuteAngleBetweenLines(L('A'),L('B'),L('N'),L('Pg'));
    const abNpgSigned=cross<0?abNpg:-abNpg;
    const odi=abMand+palFH;
    const apdi=facialAng+abNpgSigned+palFH;
    return odi+apdi;
  }},
  {name:'Interincisal Angle (Kim)',unit:'°',norm:131.3,sd:null,
    requires:['U1T','U1A','L1T','L1A'],
    calc:()=>angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'))},
  {name:'EI (Extraction Index)',unit:'°',norm:null,sd:null,requires:['A','B','Go','Me','ANS','PNS','Po','Or','N','Pg','U1T','U1A','L1T','L1A'],calc:()=>{
    const abMand=acuteAngleBetweenLines(L('A'),L('B'),L('Go'),L('Me'));
    const palFH=kimSignedPalFH();
    const facialAng=angleBetweenLines(L('N'),L('Pg'),L('Po'),L('Or'));
    const dx=L('Pg').x-L('N').x, dy=L('Pg').y-L('N').y, len=Math.sqrt(dx*dx+dy*dy);
    if(len===0) return NaN;
    const cross=dx*(L('B').y-L('N').y)-dy*(L('B').x-L('N').x);
    const abNpg=acuteAngleBetweenLines(L('A'),L('B'),L('N'),L('Pg'));
    const abNpgSigned=cross<0?abNpg:-abNpg;
    const odi=abMand+palFH;
    const apdi=facialAng+abNpgSigned+palFH;
    const cf=odi+apdi;
    const interinc=angleBetweenLines(L('U1A'),L('U1T'),L('L1A'),L('L1T'));
    if(isNaN(interinc)) return NaN;
    // EI = CF + (II - 131.3), where 131.3 is Kim's II norm
    return cf + (interinc - 131.3);
  }},
  {name:'A-B to Mand Plane',unit:'°',norm:69.3,sd:2.5,requires:['A','B','Go','Me'],
    calc:()=>acuteAngleBetweenLines(L('A'),L('B'),L('Go'),L('Me'))},
  {name:'Palatal Plane Angle (Kim)',unit:'°',norm:1.2,sd:5.4,requires:['ANS','PNS','Po','Or'],
    calc:()=>kimSignedPalFH()},
  {name:'Facial Angle',unit:'°',norm:87.8,sd:3.5,requires:['N','Pg','Po','Or'],
    calc:()=>angleBetweenLines(L('N'),L('Pg'),L('Po'),L('Or'))},
  {name:'A-B Plane Angle',unit:'°',norm:-4.4,sd:2.5,requires:['A','B','N','Pg'],
    calc:()=>{const a=acuteAngleBetweenLines(L('A'),L('B'),L('N'),L('Pg'));const dx=L('Pg').x-L('N').x,dy=L('Pg').y-L('N').y;const cross=dx*(L('B').y-L('N').y)-dy*(L('B').x-L('N').x);return cross<0?a:-a;}},
  {name:'Upper Lip to E-Plane',unit:'mm',norm:-4.7,sd:2,requires:['Prn','sPg','Ls'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;const cross=(L('Ls').x-L('Prn').x)*dy-(L('Ls').y-L('Prn').y)*dx;return px2mm(cross/len);}},
  {name:'Lower Lip to E-Plane (Kim)',unit:'mm',norm:-2,sd:2,requires:['Prn','sPg','Li'],
    calc:()=>{const dx=L('sPg').x-L('Prn').x,dy=L('sPg').y-L('Prn').y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;const cross=(L('Li').x-L('Prn').x)*dy-(L('Li').y-L('Prn').y)*dx;return px2mm(cross/len);}},
];
