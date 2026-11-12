/* Shared lifecycle for original ATREZZO Navigation 01 variants.
   No GSAP / framework / scroll replacement. */
export function createNavigationLifecycle(){
  const cleanups=[];
  let destroyed=false;
  return {
    on(target,name,listener,opts){
      target.addEventListener(name,listener,opts);
      cleanups.push(()=>target.removeEventListener(name,listener,opts));
    },
    cleanup(fn){cleanups.push(fn);},
    destroy(){
      if(destroyed)return;
      destroyed=true;
      cleanups.reverse().forEach(fn=>fn());
      cleanups.length=0;
    }
  };
}
export function reducedMotion(){
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
}
export function listenFrame(lifecycle,callback){
  let frame=0;
  const update=()=>{frame=0;callback();};
  const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
  lifecycle.on(window,"scroll",request,{passive:true});
  lifecycle.on(window,"resize",request,{passive:true});
  lifecycle.cleanup(()=>cancelAnimationFrame(frame));
  update();
  return request;
}
