/* ATREZZO SCROLL SECTIONS 03 — original progress/easing and DOM hooks; added cleanup. */
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
export function mountAts3(root){
 if(!(root instanceof Element)||!root.matches('[data-ss03]'))throw new TypeError('SS03 root required');
 if(root.__atrezzoSS03)return root.__atrezzoSS03;
 const chapters=[...root.querySelectorAll('.ss03__chapter')];
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=window.matchMedia('(max-width: 820px)');
 let scheduled=false,disposed=false,frame=0;
 function update(){
  scheduled=false;if(disposed)return;
  if(reduce.matches || mobile.matches){chapters.forEach(ch=>{ch.style.removeProperty('--exit');ch.style.removeProperty('--enter');});return;}
  const viewport=Math.max(window.innerHeight,1);
  for(let i=0;i<chapters.length;i++){
   const rect=chapters[i].getBoundingClientRect();
   const next=chapters[i+1]?.getBoundingClientRect();
   const enter=clamp((viewport-rect.top)/(viewport*.75),0,1);
   const exit=next?clamp((viewport-next.top)/viewport,0,1):0;
   chapters[i].style.setProperty('--enter',enter.toFixed(3));
   chapters[i].style.setProperty('--exit',exit.toFixed(3));
  }
 }
 function refresh(){if(!scheduled&&!disposed){scheduled=true;frame=window.requestAnimationFrame(update);}}
 const change=()=>refresh();
 window.addEventListener('scroll',refresh,{passive:true});
 window.addEventListener('resize',refresh,{passive:true});
 reduce.addEventListener?.('change',change);mobile.addEventListener?.('change',change);
 const instance={get mode(){return reduce.matches||mobile.matches?'static':'animated';},refresh,destroy(){
  if(disposed)return;disposed=true;cancelAnimationFrame(frame);
  window.removeEventListener('scroll',refresh);window.removeEventListener('resize',refresh);
  reduce.removeEventListener?.('change',change);mobile.removeEventListener?.('change',change);
  chapters.forEach(ch=>{ch.style.removeProperty('--exit');ch.style.removeProperty('--enter');});
  delete root.__atrezzoSS03;
 }};
 root.__atrezzoSS03=instance;refresh();return instance;
}
