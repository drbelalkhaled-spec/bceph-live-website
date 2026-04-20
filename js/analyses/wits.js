const WITS=[
  {name:'Wits Appraisal (AO–BO)',unit:'mm',norm:0,sd:2,requires:['A','B','Op1','Op2'],
    calc:()=>{
      const op=getOcclusalPlane();if(!op)return NaN;
      const dx=op.B.x-op.A.x,dy=op.B.y-op.A.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return NaN;
      const ux=dx/len,uy=dy/len;

      // Scalar projections of A and B onto the OP vector
      const ao=(L('A').x-op.A.x)*ux+(L('A').y-op.A.y)*uy;
      const bo=(L('B').x-op.A.x)*ux+(L('B').y-op.A.y)*uy;

      return px2mm(bo-ao);
    }},
];
