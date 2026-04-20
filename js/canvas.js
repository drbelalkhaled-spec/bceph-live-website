/* ── RENDER ── */
function render(){
  const c=cn(), x=c.getContext('2d');
  const w=c.width=c.parentElement.clientWidth, h=c.height=c.parentElement.clientHeight;
  x.clearRect(0,0,w,h); x.fillStyle='#b8c2cf'; x.fillRect(0,0,w,h);
  if(!img) return;
  x.save(); x.translate(panX,panY); x.scale(scale,scale);
  const fp=[`brightness(${enhBrightness}%)`,`contrast(${enhContrast}%)`];
  if(enhSharpen>0) fp.push(`contrast(${100+enhSharpen*0.3}%)`,'saturate(110%)');
  if(enhInvert) fp.push('invert(100%)');
  x.filter=fp.join(' ');
  x.drawImage(img,0,0,imgW,imgH);
  x.filter='none';
  if(showTracing) drawTracing(x);
  drawLandmarks(x);
  drawCalibPoints(x);
  x.restore();
}

function drawCalibPoints(x){
  if(calibMode===0&&!calibPts[0]&&!calibPts[1]) return;
  const r=Math.max(5,6/scale);
  [0,1].forEach(i=>{
    if(!calibPts[i]) return;
    const p=calibPts[i];
    x.beginPath(); x.arc(p.x,p.y,r,0,Math.PI*2); x.fillStyle='#f59e0b'; x.fill();
    x.lineWidth=2/scale; x.strokeStyle='#fff'; x.stroke();
    x.beginPath(); x.strokeStyle='rgba(245,158,11,.6)'; x.lineWidth=1/scale; x.setLineDash([3/scale,3/scale]);
    const ch=r*4; x.moveTo(p.x-ch,p.y); x.lineTo(p.x+ch,p.y); x.moveTo(p.x,p.y-ch); x.lineTo(p.x,p.y+ch); x.stroke(); x.setLineDash([]);
    x.font=`700 ${Math.max(10,12/scale)}px 'Plus Jakarta Sans',sans-serif`; x.fillStyle='#f59e0b'; x.textAlign='left'; x.textBaseline='bottom';
    x.fillText(i===0?'P1':'P2',p.x+r+3/scale,p.y-r);
  });
  if(calibPts[0]&&calibPts[1]){
    x.beginPath(); x.strokeStyle='#f59e0b'; x.lineWidth=1.5/scale; x.setLineDash([4/scale,4/scale]);
    x.moveTo(calibPts[0].x,calibPts[0].y); x.lineTo(calibPts[1].x,calibPts[1].y); x.stroke(); x.setLineDash([]);
  } else if(calibMode===2&&calibPts[0]&&calibMouseImg){
    x.beginPath(); x.strokeStyle='rgba(245,158,11,.5)'; x.lineWidth=1/scale; x.setLineDash([6/scale,4/scale]);
    x.moveTo(calibPts[0].x,calibPts[0].y); x.lineTo(calibMouseImg.x,calibMouseImg.y); x.stroke(); x.setLineDash([]);
    const mx=(calibPts[0].x+calibMouseImg.x)/2, my=(calibPts[0].y+calibMouseImg.y)/2;
    const px=dist(calibPts[0],calibMouseImg);
    x.font=`700 ${Math.max(10,13/scale)}px 'IBM Plex Mono',monospace`; x.fillStyle='#f59e0b'; x.textAlign='center'; x.textBaseline='bottom';
    x.fillText(px.toFixed(0)+' px',mx,my-6/scale);
  }
}

function drawTracing(x){
  x.lineWidth=1.5/scale; x.setLineDash([]);
  const lines=[
    {a:'S',b:'N',c:'#22d3ee'},{a:'N',b:'A',c:'#3b82f6'},{a:'N',b:'B',c:'#60a5fa'},
    {a:'Po',b:'Or',c:'#f59e0b'},{a:'Go',b:'Me',c:'#ef4444'},{a:'Go',b:'Gn',c:'#ef4444',d:true},
    {a:'ANS',b:'PNS',c:'#22c55e'},{a:'U1A',b:'U1T',c:'#d946ef'},{a:'L1A',b:'L1T',c:'#fb7185'},
    {a:'N',b:'Pg',c:'#8b5cf6',d:true},{a:'S',b:'Gn',c:'#a855f7',d:true},
    {a:'Prn',b:'sPg',c:'#f472b6',d:true},{a:'Op1',b:'Op2',c:'#38bdf8',d:true},
    // Björk polygon
    {a:'S',b:'Ar',c:'#10b981'},{a:'Ar',b:'Go',c:'#10b981'},
    // Ricketts cranial base + facial axis
    {a:'Ba',b:'N',c:'#a78bfa',d:true},{a:'Pt',b:'Gn',c:'#67e8f9',d:true},
    // H-Line (Holdaway)
    {a:'sPg',b:'Ls',c:'#facc15',d:true},
  ];
  lines.forEach(ln=>{
    if(!has(ln.a)||!has(ln.b)) return;
    x.beginPath(); x.strokeStyle=ln.c; x.globalAlpha=0.7;
    x.setLineDash(ln.d?[4/scale,4/scale]:[]);
    const a=L(ln.a),b=L(ln.b);
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy);
    if(len===0) return;
    const ext=Math.max(imgW,imgH)*0.12,ux=dx/len,uy=dy/len;
    x.moveTo(a.x-ux*ext,a.y-uy*ext); x.lineTo(b.x+ux*ext,b.y+uy*ext); x.stroke();
  });
  // 3-point occlusal plane
  const op=getOcclusalPlane();
  if(op){
    x.beginPath();x.strokeStyle='#38bdf8';x.globalAlpha=0.65;x.lineWidth=1.5/scale;
    x.setLineDash([4/scale,4/scale]);
    const dx=op.B.x-op.A.x,dy=op.B.y-op.A.y,len=Math.sqrt(dx*dx+dy*dy);
    if(len>0){const ext=Math.max(imgW,imgH)*0.12,ux=dx/len,uy=dy/len;x.moveTo(op.A.x-ux*ext,op.A.y-uy*ext);x.lineTo(op.B.x+ux*ext,op.B.y+uy*ext);}
    x.stroke();
  }
  x.globalAlpha=1; x.setLineDash([]);
}

function drawLandmarks(x){
  const r=Math.max(4,5/scale), fs=Math.max(9,11/scale);
  LM_DEFS.forEach(def=>{
    if(!has(def.id)) return;
    const p=L(def.id), isA=activeLandmark===def.id;
    x.beginPath(); x.arc(p.x,p.y,r,0,Math.PI*2);
    x.fillStyle=isA?'#fbbf24':def.color; x.fill();
    x.lineWidth=1.5/scale; x.strokeStyle='#000'; x.stroke();
    if(isA){ x.beginPath(); x.strokeStyle='rgba(251,191,36,.5)'; x.lineWidth=0.8/scale; const ch=r*3; x.moveTo(p.x-ch,p.y); x.lineTo(p.x+ch,p.y); x.moveTo(p.x,p.y-ch); x.lineTo(p.x,p.y+ch); x.stroke(); }
    if(showLabels){ x.font=`600 ${fs}px 'Plus Jakarta Sans',sans-serif`; x.fillStyle=isA?'#fbbf24':def.color; x.textAlign='left'; x.textBaseline='middle'; x.fillText(def.abbr,p.x+r+4/scale,p.y-r-4/scale); }
  });
}

/* ── IMAGE ── */
function loadImage(input){
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{ imgDataURL=e.target.result; img=new Image(); img.onload=()=>{ imgW=img.naturalWidth; imgH=img.naturalHeight; document.getElementById('no-image-msg').style.display='none'; resetView(); toast('Cephalogram loaded','🩻'); if(currentUser && typeof analytics!=='undefined') analytics.logEvent('image_uploaded'); checkAuthGate(); }; img.src=e.target.result; };
  reader.readAsDataURL(file); input.value='';
}
function resetView(){
  if(!img) return;
  const c=cn(), w=c.parentElement.clientWidth, h=c.parentElement.clientHeight;
  scale=Math.min(w/imgW,h/imgH)*0.95; panX=(w-imgW*scale)/2; panY=(h-imgH*scale)/2;
  render(); document.getElementById('zoom-display').textContent=Math.round(scale*100)+'%';
}

/* ── COORDINATE HELPERS ── */
function canvasToImage(cx,cy){ const r=cn().getBoundingClientRect(); return{x:(cx-r.left-panX)/scale, y:(cy-r.top-panY)/scale}; }
function findLandmarkAt(ip,thr){ const t=thr/scale; for(const d of LM_DEFS){ if(!has(d.id))continue; if(dist(ip,L(d.id))<t)return d.id; } return null; }

/* ── POINTER / TOUCH / STYLUS EVENTS ── */
const activePointers = new Map();
let lastPinchDist = 0;
let longPressTimer = null;
const LONG_PRESS_MS = 550;
function clearLongPress(){ if(longPressTimer){ clearTimeout(longPressTimer); longPressTimer=null; } }

document.addEventListener('DOMContentLoaded',()=>{
  const c = document.getElementById('ceph-canvas');
  const wrap = document.getElementById('canvas-wrap');

  /* Drag & drop image */
  wrap.addEventListener('dragover', e=>{ e.preventDefault(); e.dataTransfer.dropEffect='copy'; });
  wrap.addEventListener('drop', e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(!f||!f.type.startsWith('image/'))return; const r=new FileReader(); r.onload=ev=>{ imgDataURL=ev.target.result; img=new Image(); img.onload=()=>{ imgW=img.naturalWidth; imgH=img.naturalHeight; document.getElementById('no-image-msg').style.display='none'; resetView(); toast('Cephalogram loaded','🩻'); if(currentUser && typeof analytics!=='undefined') analytics.logEvent('image_uploaded'); checkAuthGate(); }; img.src=ev.target.result; }; r.readAsDataURL(f); });

  /* ── POINTER DOWN ── */
  c.addEventListener('pointerdown', e=>{
    c.setPointerCapture(e.pointerId);
    activePointers.set(e.pointerId, {x:e.clientX, y:e.clientY});

    if(!img) return;

    /* Two-finger pinch initiation */
    if(activePointers.size===2){
      clearLongPress(); mouseMoved=true;
      const pts=[...activePointers.values()];
      lastPinchDist=Math.hypot(pts[1].x-pts[0].x, pts[1].y-pts[0].y);
      isPanning=false; dragging=null; mouseDownPos=null;
      return;
    }

    mouseDownPos={x:e.clientX, y:e.clientY};
    mouseDownBtn=e.button; mouseMoved=false;

    /* Long-press on touch = remove landmark */
    if(e.pointerType==='touch'){
      const ip=canvasToImage(e.clientX,e.clientY);
      longPressTimer=setTimeout(()=>{
        const hit=findLandmarkAt(ip,18);
        if(hit){ pushUndoState(); delete landmarks[hit]; updateAllUI(); render(); toast('Removed '+hit,'🗑'); }
        longPressTimer=null;
      }, LONG_PRESS_MS);
    }

    /* Right-click: remove landmark if hit, otherwise pan */
    if(e.button===2){
      e.preventDefault(); clearLongPress();
      const ip=canvasToImage(e.clientX,e.clientY);
      const hit=findLandmarkAt(ip,12);
      if(hit){ pushUndoState(); delete landmarks[hit]; updateAllUI(); render(); toast('Removed '+hit,'🗑'); mouseDownPos=null; return; }
      /* No landmark hit — use right-click drag to pan */
      isPanning=true; panStart={x:e.clientX,y:e.clientY}; lastPanOffset={x:panX,y:panY};
      c.style.cursor='grabbing'; mouseDownPos=null; return;
    }

    /* Middle / Ctrl+click: pan */
    if(e.button===1||(e.button===0&&(e.ctrlKey||e.metaKey))){ clearLongPress(); isPanning=true; panStart={x:e.clientX,y:e.clientY}; lastPanOffset={x:panX,y:panY}; c.style.cursor='grabbing'; mouseDownPos=null; return; }

    /* Drag existing landmark */
    if(e.button===0&&calibMode===0){ const ip=canvasToImage(e.clientX,e.clientY); const hit=findLandmarkAt(ip,10); if(hit){ clearLongPress(); dragging=hit; activeLandmark=hit; updateLandmarkUI(); c.style.cursor='move'; mouseDownPos=null; pushUndoState(); return; } }

    panStart={x:e.clientX,y:e.clientY}; lastPanOffset={x:panX,y:panY};
  });

  /* ── POINTER MOVE ── */
  c.addEventListener('pointermove', e=>{
    if(activePointers.has(e.pointerId)) activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

    /* Pinch-to-zoom */
    if(activePointers.size===2){
      clearLongPress();
      const pts=[...activePointers.values()];
      const d=Math.hypot(pts[1].x-pts[0].x, pts[1].y-pts[0].y);
      const mid={x:(pts[0].x+pts[1].x)/2, y:(pts[0].y+pts[1].y)/2};
      if(lastPinchDist>0){
        const factor=d/lastPinchDist;
        const r=c.getBoundingClientRect();
        const mx=mid.x-r.left, my=mid.y-r.top;
        const os=scale;
        scale=Math.max(0.1,Math.min(20,scale*factor));
        panX=mx-(mx-panX)*(scale/os); panY=my-(my-panY)*(scale/os);
        render(); document.getElementById('zoom-display').textContent=Math.round(scale*100)+'%';
      }
      lastPinchDist=d; return;
    }

    /* Cancel long press on move */
    if(longPressTimer&&mouseDownPos){ const dx=e.clientX-mouseDownPos.x,dy=e.clientY-mouseDownPos.y; if(Math.sqrt(dx*dx+dy*dy)>8) clearLongPress(); }

    if(isPanning){ panX=lastPanOffset.x+(e.clientX-panStart.x); panY=lastPanOffset.y+(e.clientY-panStart.y); render(); return; }
    if(dragging){ const ip=canvasToImage(e.clientX,e.clientY); landmarks[dragging]={x:ip.x,y:ip.y}; updateAllUI(); render(); return; }

    if(mouseDownPos&&mouseDownBtn===0){
      const dx=e.clientX-mouseDownPos.x, dy=e.clientY-mouseDownPos.y;
      if(Math.sqrt(dx*dx+dy*dy)>DRAG_THRESHOLD){ mouseMoved=true; clearLongPress(); isPanning=true; c.style.cursor='grabbing'; panX=lastPanOffset.x+(e.clientX-panStart.x); panY=lastPanOffset.y+(e.clientY-panStart.y); render(); return; }
    }

    if(calibMode>0&&img){
      calibMouseImg=canvasToImage(e.clientX,e.clientY); render();
      if(calibMode===2&&calibPts[0]&&calibMouseImg) document.getElementById('calib-hud-dist').textContent=dist(calibPts[0],calibMouseImg).toFixed(0)+' px';
    }
    if(img&&e.pointerType!=='touch'){ c.style.cursor=(calibMode>0)?'crosshair':(findLandmarkAt(canvasToImage(e.clientX,e.clientY),10)?'move':'crosshair'); }
  });

  /* ── POINTER UP ── */
  c.addEventListener('pointerup', e=>{
    activePointers.delete(e.pointerId);
    clearLongPress();
    if(activePointers.size<2) lastPinchDist=0;

    const wasPanning=isPanning, wasDragging=dragging;
    if(dragging){ dragging=null; c.style.cursor='crosshair'; }
    if(isPanning){ isPanning=false; c.style.cursor='crosshair'; }

    if(wasPanning||wasDragging||mouseMoved){ mouseDownPos=null; mouseDownBtn=-1; mouseMoved=false; return; }

    if(mouseDownPos&&mouseDownBtn===0&&img){
      const ip=canvasToImage(e.clientX,e.clientY);
      if(calibMode>0){
        if(calibMode===1){ calibPts[0]=ip; calibMode=2; render(); updateCalibHUD(); toast('Now click the SECOND point on the ruler','📏'); }
        else if(calibMode===2){ calibPts[1]=ip; calibMode=0; calibMouseImg=null; render(); finishCalibClicks(); }
        mouseDownPos=null; mouseDownBtn=-1; return;
      }
      if(activeLandmark){ pushUndoState(); landmarks[activeLandmark]={x:ip.x,y:ip.y}; updateAllUI(); render(); advanceToNext(); }
    }
    mouseDownPos=null; mouseDownBtn=-1; mouseMoved=false;
  });

  c.addEventListener('pointercancel', e=>{ activePointers.delete(e.pointerId); clearLongPress(); dragging=null; isPanning=false; mouseDownPos=null; calibMouseImg=null; if(activePointers.size<2)lastPinchDist=0; });
  c.addEventListener('pointerleave', e=>{ if(e.pointerType!=='touch'){ activePointers.delete(e.pointerId); dragging=null; isPanning=false; mouseDownPos=null; calibMouseImg=null; } });

  /* Scroll wheel zoom */
  c.addEventListener('wheel', e=>{
    if(!img) return; e.preventDefault();
    const r=c.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top;
    const os=scale; scale=Math.max(0.1,Math.min(20,scale*(e.deltaY<0?1.1:1/1.1)));
    panX=mx-(mx-panX)*(scale/os); panY=my-(my-panY)*(scale/os);
    render(); document.getElementById('zoom-display').textContent=Math.round(scale*100)+'%';
  },{passive:false});

  c.addEventListener('contextmenu', e=>e.preventDefault());
  new ResizeObserver(()=>render()).observe(wrap);

  /* ── KEYBOARD ── */
  let arrowNudgeActive=false;
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'&&calibMode>0){ cancelCalibration(); toast('Calibration cancelled','❌'); }
    if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==='z'){ e.preventDefault(); undoLandmark(); }
    if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.shiftKey&&e.key==='Z'))){ e.preventDefault(); redoLandmark(); }

    /* Arrow key nudge */
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
      if(activeLandmark&&has(activeLandmark)){
        e.preventDefault();
        if(!arrowNudgeActive){ pushUndoState(); arrowNudgeActive=true; }
        const delta=e.shiftKey?5:1;
        const lm=landmarks[activeLandmark];
        if(e.key==='ArrowLeft')  lm.x-=delta;
        if(e.key==='ArrowRight') lm.x+=delta;
        if(e.key==='ArrowUp')    lm.y-=delta;
        if(e.key==='ArrowDown')  lm.y+=delta;
        updateAllUI(); render();
      }
    }
  });
  document.addEventListener('keyup', e=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) arrowNudgeActive=false;
  });
});

/* ── LANDMARK SELECTION ── */
function selectLandmark(id){
  activeLandmark=id; document.getElementById('landmark-selector').value=id;
  const def=LM_DEFS.find(d=>d.id===id);
  document.getElementById('lm-hint').textContent=def?def.desc:'';
  updateLandmarkUI(); render();
}
function advanceToNext(){
  const required=getRequiredLandmarkIds();
  const requiredOrdered=LM_IDS.filter(id=>required.has(id));
  const idx=requiredOrdered.indexOf(activeLandmark);
  for(let i=1;i<=requiredOrdered.length;i++){
    const nid=requiredOrdered[(idx+i)%requiredOrdered.length];
    if(!has(nid)&&!skippedLandmarks.has(nid)){ selectLandmark(nid); return; }
  }
  updateLandmarkUI();
}
