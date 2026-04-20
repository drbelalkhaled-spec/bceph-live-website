function dist(a,b){ return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }
function angleAtVertex(A,B,C){
  const v1x=A.x-B.x,v1y=A.y-B.y,v2x=C.x-B.x,v2y=C.y-B.y;
  const dot=v1x*v2x+v1y*v2y, m1=Math.sqrt(v1x*v1x+v1y*v1y), m2=Math.sqrt(v2x*v2x+v2y*v2y);
  if(m1===0||m2===0)return NaN;
  return Math.acos(Math.max(-1,Math.min(1,dot/(m1*m2))))*180/Math.PI;
}
function acuteAngleBetweenLines(A,B,C,D){
  const v1x=B.x-A.x,v1y=B.y-A.y,v2x=D.x-C.x,v2y=D.y-C.y;
  const dot=v1x*v2x+v1y*v2y, m1=Math.sqrt(v1x*v1x+v1y*v1y), m2=Math.sqrt(v2x*v2x+v2y*v2y);
  if(m1===0||m2===0)return NaN;
  return Math.acos(Math.max(-1,Math.min(1,Math.abs(dot)/(m1*m2))))*180/Math.PI;
}
function angleBetweenLines(A,B,C,D){
  const v1x=B.x-A.x,v1y=B.y-A.y,v2x=D.x-C.x,v2y=D.y-C.y;
  const dot=v1x*v2x+v1y*v2y, m1=Math.sqrt(v1x*v1x+v1y*v1y), m2=Math.sqrt(v2x*v2x+v2y*v2y);
  if(m1===0||m2===0)return NaN;
  return Math.acos(Math.max(-1,Math.min(1,dot/(m1*m2))))*180/Math.PI;
}
function perpDist(P,A,B){
  const dx=B.x-A.x,dy=B.y-A.y,len=Math.sqrt(dx*dx+dy*dy);
  if(len===0)return NaN;
  return Math.abs(dx*(A.y-P.y)-dy*(A.x-P.x))/len;
}
function signedPerpDist(P,A,B){
  const dx=B.x-A.x,dy=B.y-A.y,len=Math.sqrt(dx*dx+dy*dy);
  if(len===0)return NaN;
  return (dx*(A.y-P.y)-dy*(A.x-P.x))/len;
}
function px2mm(px){ return pixelsPerMm>0?px/pixelsPerMm:NaN; }
function has(id){ return landmarks[id]!=null; }
function L(id){ return landmarks[id]; }
